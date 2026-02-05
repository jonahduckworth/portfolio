'use client';

import { useEffect, useRef } from 'react';

const CODE_CHARS = ['{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '&', '|', '+', '*', '0', '1', '_', ':', '#'];

// World map as elliptical regions: [centerX, centerY, radiusX, radiusY]
// Normalized 0-1 coords, roughly equirectangular projection
const LAND_REGIONS: [number, number, number, number][] = [
  // North America
  [0.10, 0.18, 0.04, 0.04],   // Western Canada / BC / Alberta
  [0.17, 0.16, 0.05, 0.04],   // Eastern Canada / Ontario / Quebec
  [0.24, 0.13, 0.03, 0.03],   // Atlantic Canada / Maritimes
  [0.13, 0.26, 0.05, 0.04],   // Northern US (Washington to Great Lakes)
  [0.16, 0.33, 0.05, 0.03],   // Southern US
  [0.22, 0.30, 0.02, 0.03],   // US East Coast
  [0.12, 0.39, 0.025, 0.03],  // Mexico
  [0.05, 0.17, 0.02, 0.025],  // Alaska
  [0.29, 0.10, 0.025, 0.03],  // Greenland

  // South America
  [0.26, 0.48, 0.04, 0.04],
  [0.29, 0.56, 0.045, 0.05],
  [0.26, 0.66, 0.025, 0.05],
  [0.24, 0.74, 0.012, 0.03],

  // Europe
  [0.47, 0.18, 0.03, 0.03],   // UK / France / Benelux
  [0.52, 0.17, 0.03, 0.04],   // Germany / Poland / Baltics
  [0.53, 0.11, 0.02, 0.03],   // Scandinavia
  [0.45, 0.27, 0.02, 0.02],   // Iberian Peninsula
  [0.50, 0.25, 0.03, 0.02],   // Italy / Balkans / Greece
  [0.57, 0.20, 0.03, 0.03],   // Eastern Europe / Ukraine

  // Africa
  [0.48, 0.34, 0.06, 0.04],   // North Africa (Morocco to Egypt)
  [0.47, 0.42, 0.03, 0.04],   // West Africa
  [0.52, 0.42, 0.03, 0.04],   // Central/East Africa north
  [0.50, 0.52, 0.04, 0.06],   // Central Africa
  [0.52, 0.62, 0.025, 0.04],  // East Africa south
  [0.49, 0.68, 0.02, 0.025],  // Southern Africa

  // Asia
  [0.62, 0.12, 0.08, 0.04],
  [0.76, 0.12, 0.08, 0.04],
  [0.85, 0.14, 0.04, 0.03],
  [0.61, 0.24, 0.06, 0.04],
  [0.76, 0.24, 0.06, 0.05],
  [0.64, 0.35, 0.03, 0.05],
  [0.73, 0.37, 0.04, 0.03],
  [0.58, 0.30, 0.025, 0.025],

  // Oceania
  [0.85, 0.61, 0.06, 0.05],   // Australia (bigger)
  [0.80, 0.42, 0.035, 0.015], // Indonesia
  [0.93, 0.72, 0.015, 0.02],  // New Zealand
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
  group: number;
}

function sampleFromRegions(W: number, H: number, count: number): Particle[] {
  const isPortrait = W < H;

  let mapW: number, mapH: number, offsetX: number, offsetY: number;

  if (isPortrait) {
    // Vertical map: 1:2 aspect (tall), fit to screen
    const mapAspect = 0.5;
    mapH = H * 0.85;
    mapW = mapH * mapAspect;
    if (mapW > W * 0.90) {
      mapW = W * 0.90;
      mapH = mapW / mapAspect;
    }
    offsetX = (W - mapW) / 2;
    offsetY = H * 0.06;
  } else {
    const mapAspect = 2;
    const viewAspect = W / H;
    if (viewAspect > mapAspect) {
      mapH = H * 0.95;
      mapW = mapH * mapAspect;
      offsetX = (W - mapW) / 2;
      offsetY = H * 0.03;
    } else {
      mapW = W * 0.96;
      mapH = mapW / mapAspect;
      offsetX = W * 0.02;
      offsetY = (H - mapH) / 2 + H * 0.15;
    }
  }

  const areas = LAND_REGIONS.map(([, , rx, ry]) => Math.PI * rx * ry);
  const totalArea = areas.reduce((s, a) => s + a, 0);

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
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

    const angle = Math.random() * Math.PI * 2;
    const rad = Math.sqrt(Math.random());

    let nx: number, ny: number;
    if (isPortrait) {
      // Rotate 90° CW: (x,y) → (1-y, x), swap radii to preserve shapes
      const rcx = 1 - cy;
      const rcy = cx;
      const rrx = ry; // horizontal radius becomes what was vertical
      const rry = rx; // vertical radius becomes what was horizontal
      nx = rcx + Math.cos(angle) * rrx * rad;
      ny = rcy + Math.sin(angle) * rry * rad;
    } else {
      nx = cx + Math.cos(angle) * rx * rad;
      ny = cy + Math.sin(angle) * ry * rad;
    }

    const px = offsetX + nx * mapW;
    const py = offsetY + ny * mapH;

    particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
      alpha: 0.22 + Math.random() * 0.38,
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

      const count = Math.min(1000, Math.max(300, Math.floor((W * H) / 1600)));
      particlesRef.current = sampleFromRegions(W, H, count);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const CELL_SIZE = 70;

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

      // Original physics: short-range repulsion + medium-range attraction
      const REPEL_DIST = 25;
      const REPEL_STRENGTH = 0.6;
      const ATTRACT_MIN = 25;
      const ATTRACT_MAX = 55;
      const ATTRACT_STRENGTH = 0.015;
      const MOUSE_DIST = 180;
      const MOUSE_STRENGTH = 3.0;
      const DAMPING = 0.92;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = Math.floor(p.x / CELL_SIZE);
        const row = Math.floor(p.y / CELL_SIZE);

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
                const force = REPEL_STRENGTH * (1 - dist / REPEL_DIST);
                fx = (dx / dist) * force;
                fy = (dy / dist) * force;
              } else if (dist > ATTRACT_MIN && dist < ATTRACT_MAX) {
                const t = (dist - ATTRACT_MIN) / (ATTRACT_MAX - ATTRACT_MIN);
                const force = ATTRACT_STRENGTH * Math.max(0, t);
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

        // Mouse repulsion
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_DIST && mDist > 0.1) {
          const mForce = MOUSE_STRENGTH * Math.pow(1 - mDist / MOUSE_DIST, 2);
          p.vx += (mdx / mDist) * mForce;
          p.vy += (mdy / mDist) * mForce;
        }

        // Soft boundary forces
        const margin = 30;
        const bForce = 0.3;
        if (p.x < margin) p.vx += bForce * (1 - p.x / margin);
        if (p.x > W - margin) p.vx -= bForce * (1 - (W - p.x) / margin);
        if (p.y < margin) p.vy += bForce * (1 - p.y / margin);
        if (p.y > H - margin) p.vy -= bForce * (1 - (H - p.y) / margin);

        // Tiny organic jitter
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 3) {
          p.vx = (p.vx / speed) * 3;
          p.vy = (p.vy / speed) * 3;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(0, Math.min(W, p.x));
        p.y = Math.max(0, Math.min(H, p.y));
      }

      // Render
      ctx.clearRect(0, 0, W, H);
      const fontSize = W < 640 ? 7 : 10;
      ctx.font = `${fontSize}px "Geist Mono", ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        switch (p.group) {
          case 0:
            ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
            break;
          case 1:
            ctx.fillStyle = `rgba(245, 235, 220, ${p.alpha * 0.65})`;
            break;
          case 2:
            ctx.fillStyle = `rgba(170, 170, 190, ${p.alpha * 0.5})`;
            break;
          default:
            ctx.fillStyle = `rgba(140, 140, 160, ${p.alpha * 0.4})`;
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
