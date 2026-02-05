'use client';

import { useEffect, useRef } from 'react';

const CODE_CHARS = ['{', '}', '<', '>', '/', '=', ';', '(', ')', '[', ']', '&', '|', '+', '*', '0', '1', '_', ':', '#'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
  group: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-init particles on resize if needed
      if (!initializedRef.current || particlesRef.current.length === 0) {
        initParticles();
        initializedRef.current = true;
      }
    };

    const initParticles = () => {
      // ~1 particle per 2500px² area, capped at 600
      const count = Math.min(600, Math.max(200, Math.floor((W * H) / 2500)));
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
          alpha: 0.12 + Math.random() * 0.28,
          group: Math.floor(Math.random() * 4), // 0=accent, 1-3=white variants
        });
      }
      particlesRef.current = particles;
    };

    resize();
    window.addEventListener('resize', resize);

    // Spatial grid
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

      // Populate grid
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const col = Math.floor(p.x / CELL_SIZE);
        const row = Math.floor(p.y / CELL_SIZE);
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          grid[row * cols + col].push(i);
        }
      }

      // Force parameters
      // Short range repulsion + medium range attraction = cell membrane structures
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

        // Check neighboring cells
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
              const distSq = dx * dx + dy * dy;
              const dist = Math.sqrt(distSq);

              if (dist < 0.1) continue;

              let fx = 0;
              let fy = 0;

              if (dist < REPEL_DIST) {
                // Strong close-range repulsion
                const force = REPEL_STRENGTH * (1 - dist / REPEL_DIST);
                fx = (dx / dist) * force;
                fy = (dy / dist) * force;
              } else if (dist < ATTRACT_MAX) {
                // Medium-range attraction (forms chains/membranes)
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

        // Tiny random jitter for organic feel
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

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Clamp to canvas
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
            // Orange accent
            ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * 0.9})`;
            break;
          case 1:
            // Warm white
            ctx.fillStyle = `rgba(245, 235, 220, ${p.alpha * 0.5})`;
            break;
          case 2:
            // Cool gray
            ctx.fillStyle = `rgba(160, 160, 180, ${p.alpha * 0.35})`;
            break;
          default:
            // Dim
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
      window.removeEventListener('resize', resize);
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
