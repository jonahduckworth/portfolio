import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    const starCount = 800;

    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      opacity: number;
      speed: number;

      constructor() {
        this.x = (Math.random() - 0.5) * canvas!.width * 3;
        this.y = (Math.random() - 0.5) * canvas!.height * 3;
        this.z = Math.random() * 2000;
        this.size = 1;
        this.opacity = 0;
        this.speed = 0.3;
      }

      update() {
        const centerX = canvas!.width / 2;
        const centerY = canvas!.height / 2;

        this.z -= this.speed + this.z * 0.001;

        if (this.z < 1) {
          this.z = 2000;
          this.x = (Math.random() - 0.5) * canvas!.width * 3;
          this.y = (Math.random() - 0.5) * canvas!.height * 3;
        }

        const projectedX = (this.x / this.z) * 1000 + centerX;
        const projectedY = (this.y / this.z) * 1000 + centerY;

        this.size = (1 - this.z / 2000) * 2;
        this.opacity = (1 - this.z / 2000) * 0.7;

        return { x: projectedX, y: projectedY };
      }

      draw(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
        const gradient = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          this.size * 2
        );
        gradient.addColorStop(0, `rgba(147, 197, 253, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(147, 197, 253, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initializeStars = () => {
      stars = Array.from({ length: starCount }, () => new Star());
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 9, 19, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const pos = star.update();
        star.draw(ctx, pos);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 w-full h-full'
      style={{ background: '#000913' }}
    />
  );
};

export default AnimatedBackground;
