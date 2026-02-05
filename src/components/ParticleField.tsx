'use client';

import { useEffect, useRef } from 'react';

const CODE_CHARS = ['{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '&', '|', '+', '*', '0', '1', '_', ':', '#'];

// World map as elliptical regions: [centerX, centerY, radiusX, radiusY]
// Normalized 0-1 coords, roughly equirectangular projection
const LAND_REGIONS: [number, number, number, number][] = [
  // North America
  [0.12, 0.15, 0.06, 0.06],  // Northern Canada
  [0.16, 0.24, 0.06, 0.05],  // Southern Canada / Northern US
  [0.18, 0.32, 0.05, 0.04],  // US
  [0.14, 0.38, 0.025, 0.04], // Mexico
  [0.06, 0.16, 0.025, 0.03], // Alaska
  [0.30, 0.10, 0.025, 0.03], // Greenland

  // South America
  [0.26, 0.48, 0.04, 0.04],   // Northern SA (Colombia/Venezuela)
  [0.29, 0.56, 0.045, 0.05],  // Brazil
  [0.26, 0.66, 0.025, 0.05],  // Argentina
  [0.24, 0.74, 0.012, 0.03],  // Chile/Patagonia

  // Europe
  [0.49, 0.20, 0.035, 0.05],  // Western Europe
  [0.53, 0.14, 0.02, 0.04],   // Scandinavia
  [0.46, 0.28, 0.02, 0.02],   // Iberian Peninsula
  [0.53, 0.26, 0.02, 0.015],  // Italy/Balkans

  // Africa
  [0.49, 0.36, 0.05, 0.04],   // North Africa
  [0.50, 0.47, 0.04, 0.06],   // West/Central Africa
  [0.53, 0.57, 0.025, 0.04],  // East Africa
  [0.51, 0.65, 0.02, 0.025],  // Southern Africa

  // Asia
  [0.62, 0.12, 0.08, 0.04],   // Russia West
  [0.76, 0.12, 0.08, 0.04],   // Russia/Siberia East
  [0.85, 0.14, 0.04, 0.03],   // Far East Russia
  [0.61, 0.24, 0.06, 0.04],   // Central Asia / Middle East
  [0.76, 0.24, 0.06, 0.05],   // China / Korea / Japan
  [0.64, 0.35, 0.03, 0.05],   // India
  [0.73, 0.37, 0.04, 0.03],   // SE Asia mainland
  [0.58, 0.30, 0.025, 0.025], // Arabia

  // Oceania
  [0.86, 0.63, 0.05, 0.035],  // Australia
  [0.80, 0.42, 0.03, 0.012],  // Indonesia
  [0.93, 0.71, 0.012, 0.015], // New Zealand
];

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
  group: number;
}

function sampleFromRegions(W: number, H: number, count: number): Particle[] {
  // Maintain ~2:1 aspect ratio for the world map, centered
  const mapAspect = 2;
  const viewAspect = W / H;

  let mapW: number, mapH: number, offsetX: number, offsetY: number;
  if (viewAspect > mapAspect) {
    mapH = H * 0.88;
    mapW = mapH * mapAspect;
    offsetX = (W - mapW) / 2;
    offsetY = H * 0.06;
  } else {
    mapW = W * 0.92;
    mapH = mapW / mapAspect;
    offsetX = W * 0.04;
    offsetY = (H - mapH) / 2;
  }

  // Weight regions by area for proportional sampling
  const areas = LAND_REGIONS.map(([, , rx, ry]) => Math.PI * rx * ry);
  const totalArea = areas.reduce((s, a) => s + a, 0);

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    // Pick region weighted by area
    let r = Math.random() * totalArea;
    let regionIdx = 0;
    for (let j = 0; j < areas.length; j++) {
      r -= areas[j];
      if (r <= 0) {
        regionIdx = j;
        break;
      }
    }

    const [cx, cy, rx, ry] = LAND_REGIONS[regionIdx];

    // Uniform random point in ellipse
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.sqrt(Math.random());
    const nx = cx + Math.cos(angle) * rx * rad;
    const ny = cy + Math.sin(angle) * ry * rad;

    const px = offsetX + nx * mapW;
    const py = offsetY + ny * mapH;

    particles.push({
      x: px,
      y: py,
      homeX: px,
      homeY: py,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      alpha: 0.14 + Math.random() * 0.28,
      group: Math.floor(Math.random() * 4),
    });
  }

  return particles;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Reinit particles with new dimensions
      const count = Math.min(800, Math.max(300, Math.floor((W * H) / 1800)));
      particlesRef.current = sampleFromRegions(W, H, count);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Spatial grid
    const CELL_SIZE = 60;

    const animate = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const cols = Math.ceil(W / CELL_SIZE) + 1;
      const rows = Math.ceil(H / CELL_SIZE) + 1;
      const gridSize = cols * rows;
      const grid: number[][] = new Array(gridSize);
      for (let i = 0; i < gridSize; i++) grid[i] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = Math.floor(p.x / CELL_SIZE);
        const row = Math.floor(p.y / CELL_SIZE);
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          grid[row * cols + col].push(i);
        }
      }

      // Physics params
      const REPEL_DIST = 20;
      const REPEL_STRENGTH = 0.5;
      const ATTRACT_MIN = 20;
      const ATTRACT_MAX = 42;
      const ATTRACT_STRENGTH = 0.008;
      const HOME_STRENGTH = 0.004;
      const MOUSE_DIST = 200;
      const MOUSE_STRENGTH = 4.5;
      const DAMPING = 0.88;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = Math.floor(p.x / CELL_SIZE);
        const row = Math.floor(p.y / CELL_SIZE);

        // Neighbor interactions
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            const cell = grid[nr * cols + nc];
            for (let k = 0; k < cell.length; k++) {
              const j = cell[k];
              if (j <= i) continue;
              const q = particles[j];
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 0.1) continue;

              let fx = 0;
              let fy = 0;

              if (dist < REPEL_DIST) {
                // Short-range repulsion
                const force = REPEL_STRENGTH * (1 - dist / REPEL_DIST);
                fx = (dx / dist) * force;
                fy = (dy / dist) * force;
              } else if (dist > ATTRACT_MIN && dist < ATTRACT_MAX) {
                // Medium-range attraction (forms membrane/cell structures)
                const t = (dist - ATTRACT_MIN) / (ATTRACT_MAX - ATTRACT_MIN);
                const force = ATTRACT_STRENGTH * t;
                fx = -(dx / dist) * force;
                fy = -(dy / dist) * force;
              }

              if (fx !== 0 || fy !== 0) {
                p.vx += fx;
                p.vy += fy;
                q.vx -= fx;
                q.vy -= fy;
              }
            }
          }
        }

        // Gentle spring toward home position (keeps map shape)
        const hdx = p.homeX - p.x;
        const hdy = p.homeY - p.y;
        p.vx += hdx * HOME_STRENGTH;
        p.vy += hdy * HOME_STRENGTH;

        // Mouse repulsion
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_DIST && mDist > 0.1) {
          const mForce = MOUSE_STRENGTH * Math.pow(1 - mDist / MOUSE_DIST, 2);
          p.vx += (mdx / mDist) * mForce;
          p.vy += (mdy / mDist) * mForce;
        }

        // Boundary forces
        const margin = 15;
        if (p.x < margin) p.vx += 0.4;
        if (p.x > W - margin) p.vx -= 0.4;
        if (p.y < margin) p.vy += 0.4;
        if (p.y > H - margin) p.vy -= 0.4;

        // Organic jitter
        p.vx += (Math.random() - 0.5) * 0.15;
        p.vy += (Math.random() - 0.5) * 0.15;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 4) {
          p.vx = (p.vx / speed) * 4;
          p.vy = (p.vy / speed) * 4;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));
      }

      // Render
      ctx.clearRect(0, 0, W, H);
      ctx.font = '10px "Geist Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        switch (p.group) {
          case 0:
            ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
            break;
          case 1:
            ctx.fillStyle = `rgba(245, 235, 220, ${p.alpha * 0.5})`;
            break;
          case 2:
            ctx.fillStyle = `rgba(160, 160, 180, ${p.alpha * 0.35})`;
            break;
          default:
            ctx.fillStyle = `rgba(120, 120, 140, ${p.alpha * 0.25})`;
            break;
        }
        ctx.fillText(p.char, p.x, p.y);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
