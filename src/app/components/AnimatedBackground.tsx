import { useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  // Camera position and target
  const cameraRef = useRef({
    x: 0,
    y: 0,
    z: 0,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    zoom: 1,
    targetZoom: 1,
    isHeroView: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let orbitalLights: OrbitalLight[] = [];
    const orbitalCount = 8;
    const PERSPECTIVE = 800;
    const ORBIT_TILT = Math.PI * 0.2;
    const ZOOM_LEVEL = 2.5;
    const CAMERA_LERP = 0.05;
    const SUN_SIZE = 35;

    const ORBITAL_CONFIGS = {
      MERCURY: {
        radius: 60,
        speed: 0.47,
        size: 1.2,
        color: '#E5E5E5',
        inclination: 0.03,
        glowIntensity: 0.8,
        trailEffect: 'comet',
      },
      VENUS: {
        radius: 90,
        speed: 0.35,
        size: 1.8,
        color: '#FFD700',
        inclination: 0.05,
        glowIntensity: 1.2,
        trailEffect: 'sparkle',
      },
      EARTH: {
        radius: 120,
        speed: 0.29,
        size: 2.0,
        color: '#4169E1',
        inclination: 0.04,
        glowIntensity: 1.5,
        trailEffect: 'wave',
      },
      MARS: {
        radius: 150,
        speed: 0.24,
        size: 1.5,
        color: '#FF4500',
        inclination: 0.06,
        glowIntensity: 1.0,
        trailEffect: 'comet',
      },
      JUPITER: {
        radius: 240,
        speed: 0.13,
        size: 4.0,
        color: '#DEB887',
        inclination: 0.02,
        glowIntensity: 2.0,
        trailEffect: 'rings',
      },
      SATURN: {
        radius: 285,
        speed: 0.097,
        size: 3.5,
        color: '#F4A460',
        inclination: 0.04,
        glowIntensity: 1.8,
        trailEffect: 'rings',
      },
      URANUS: {
        radius: 330,
        speed: 0.067,
        size: 2.8,
        color: '#87CEEB',
        inclination: 0.08,
        glowIntensity: 1.3,
        trailEffect: 'wave',
      },
      NEPTUNE: {
        radius: 375,
        speed: 0.054,
        size: 2.7,
        color: '#1E90FF',
        inclination: 0.07,
        glowIntensity: 1.4,
        trailEffect: 'sparkle',
      },
    };

    interface ProjectedPosition {
      x: number;
      y: number;
      scale: number;
      opacity: number;
      z: number;
    }

    class OrbitalLight {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      opacity: number;
      color: string;
      pulsePhase: number;
      orbitEccentricity: number;
      orbitTilt: number;
      inclination: number;
      trailLength: number;
      trailPoints: Array<{ x: number; y: number; z: number; opacity: number }>;
      glowIntensity: number;
      trailEffect: string;
      sparkles: Array<{ x: number; y: number; opacity: number; size: number }>;
      wavePhase: number;

      constructor(orbitIndex: number) {
        const planets = [
          ORBITAL_CONFIGS.MERCURY,
          ORBITAL_CONFIGS.VENUS,
          ORBITAL_CONFIGS.EARTH,
          ORBITAL_CONFIGS.MARS,
          ORBITAL_CONFIGS.JUPITER,
          ORBITAL_CONFIGS.SATURN,
          ORBITAL_CONFIGS.URANUS,
          ORBITAL_CONFIGS.NEPTUNE,
        ];
        const planet = planets[orbitIndex];

        this.angle = Math.random() * Math.PI * 2;
        this.radius = planet.radius;
        this.speed = planet.speed * 0.02;
        this.size = planet.size;
        this.color = planet.color;
        this.opacity = 0.8;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.orbitEccentricity = 0.05 + Math.random() * 0.05;
        this.inclination = planet.inclination;
        this.orbitTilt = 0.05 + Math.random() * 0.05;
        this.glowIntensity = planet.glowIntensity;
        this.trailEffect = planet.trailEffect;
        this.sparkles = [];
        this.wavePhase = Math.random() * Math.PI * 2;
        this.trailLength = planet.trailEffect === 'comet' ? 18 : 12;
        this.trailPoints = [];
      }

      project(x: number, y: number, z: number, rotationAngle: number) {
        const camera = cameraRef.current;
        const rotatedX =
          x * Math.cos(rotationAngle) - z * Math.sin(rotationAngle);
        const rotatedZ =
          x * Math.sin(rotationAngle) + z * Math.cos(rotationAngle);

        // Apply camera transformation
        const relativeX = rotatedX - camera.x;
        const relativeY = y - camera.y;
        const relativeZ = rotatedZ - camera.z;

        const scale = (PERSPECTIVE / (PERSPECTIVE + relativeZ)) * camera.zoom;
        const projectedX = relativeX * scale + canvas!.width / 2;
        const projectedY = relativeY * scale + canvas!.height / 2;

        return { x: projectedX, y: projectedY, scale };
      }

      update(rotationAngle: number) {
        this.angle += this.speed;
        this.pulsePhase += 0.02;

        const effectiveRadius =
          this.radius * (1 + Math.sin(this.angle) * this.orbitEccentricity);
        const x = Math.cos(this.angle) * effectiveRadius;
        const y = Math.sin(this.angle) * effectiveRadius;

        const inclinedY =
          y * Math.cos(this.inclination) -
          effectiveRadius * Math.sin(this.inclination) * Math.sin(this.angle);
        const z =
          y * Math.sin(this.inclination) +
          effectiveRadius * Math.cos(this.inclination) * Math.sin(this.angle);

        const tiltedY =
          inclinedY * Math.cos(ORBIT_TILT) - z * Math.sin(ORBIT_TILT);
        const finalZ =
          inclinedY * Math.sin(ORBIT_TILT) + z * Math.cos(ORBIT_TILT);

        const projected = this.project(x, tiltedY, finalZ, rotationAngle);
        const pulseOpacity =
          this.opacity * (0.9 + Math.sin(this.pulsePhase) * 0.1);

        this.trailPoints.unshift({
          x,
          y: tiltedY,
          z: finalZ,
          opacity: pulseOpacity,
        });
        if (this.trailPoints.length > this.trailLength) {
          this.trailPoints.pop();
        }

        return { ...projected, opacity: pulseOpacity, z: finalZ };
      }

      drawTrailEffects(ctx: CanvasRenderingContext2D, pos: ProjectedPosition) {
        switch (this.trailEffect) {
          case 'comet':
            this.drawCometTrail(ctx);
            break;
          case 'sparkle':
            this.drawSparkleTrail(ctx, pos);
            break;
          case 'wave':
            this.drawWaveTrail(ctx);
            break;
          case 'rings':
            this.drawRings(ctx, pos);
            break;
        }
      }

      drawCometTrail(ctx: CanvasRenderingContext2D) {
        const sortedTrailPoints = [...this.trailPoints]
          .map((point) => ({
            ...point,
            projected: this.project(point.x, point.y, point.z, rotation.get()),
          }))
          .sort((a, b) => b.z - a.z);

        sortedTrailPoints.forEach((point, index) => {
          const { x, y, scale } = point.projected;
          const trailOpacity =
            point.opacity *
            (1 - index / this.trailLength) *
            Math.max(0.3, (PERSPECTIVE + point.z) / (PERSPECTIVE * 2));
          const trailSize =
            this.size * scale * (1 - (index / this.trailLength) * 0.2);

          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            trailSize * 4
          );
          const [r, g, b] = this.hexToRgb(this.color);
          gradient.addColorStop(
            0,
            `rgba(${r}, ${g}, ${b}, ${trailOpacity * 1.5})`
          );
          gradient.addColorStop(
            0.4,
            `rgba(${r}, ${g}, ${b}, ${trailOpacity * 0.6})`
          );
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(x, y, trailSize * 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      drawSparkleTrail(ctx: CanvasRenderingContext2D, pos: ProjectedPosition) {
        if (Math.random() < 0.3) {
          this.sparkles.push({
            x: pos.x + (Math.random() - 0.5) * 30,
            y: pos.y + (Math.random() - 0.5) * 30,
            opacity: 1,
            size: Math.random() * 2 + 1,
          });
        }

        this.sparkles = this.sparkles
          .map((sparkle) => ({
            ...sparkle,
            opacity: sparkle.opacity * 0.95,
            size: sparkle.size * 0.98,
          }))
          .filter((sparkle) => sparkle.opacity > 0.1);

        this.sparkles.forEach((sparkle) => {
          const [r, g, b] = this.hexToRgb(this.color);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${sparkle.opacity})`;
          ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      drawWaveTrail(ctx: CanvasRenderingContext2D) {
        const sortedTrailPoints = [...this.trailPoints]
          .map((point) => ({
            ...point,
            projected: this.project(point.x, point.y, point.z, rotation.get()),
          }))
          .sort((a, b) => b.z - a.z);

        ctx.beginPath();
        sortedTrailPoints.forEach((point, index) => {
          const { x, y } = point.projected;
          const waveAmplitude = 5 * Math.sin(this.wavePhase + index * 0.3);
          const waveX = x + waveAmplitude * Math.cos(this.angle);
          const waveY = y + waveAmplitude * Math.sin(this.angle);

          if (index === 0) {
            ctx.moveTo(waveX, waveY);
          } else {
            ctx.lineTo(waveX, waveY);
          }
        });

        const [r, g, b] = this.hexToRgb(this.color);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        this.wavePhase += 0.1;
      }

      drawRings(ctx: CanvasRenderingContext2D, pos: ProjectedPosition) {
        const ringCount = 3;
        const [r, g, b] = this.hexToRgb(this.color);

        for (let i = 0; i < ringCount; i++) {
          const ringRadius = this.size * pos.scale * (2 + i * 0.8);
          const ringOpacity = 0.2 - i * 0.05;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${ringOpacity})`;
          ctx.lineWidth = 1 + (ringCount - i) * 0.5;
          ctx.ellipse(
            pos.x,
            pos.y,
            ringRadius,
            ringRadius * Math.abs(Math.cos(this.angle * 0.5)),
            this.angle,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      drawPlanetDetails(ctx: CanvasRenderingContext2D, pos: ProjectedPosition) {
        const camera = cameraRef.current;
        const isZoomedIn = camera.zoom > 1.5;

        if (isZoomedIn) {
          const scaledSize = this.size * pos.scale;
          const [r, g, b] = this.hexToRgb(this.color);

          // Create atmospheric effect
          const atmosphere = ctx.createRadialGradient(
            pos.x,
            pos.y,
            scaledSize * 0.8,
            pos.x,
            pos.y,
            scaledSize * 2
          );
          atmosphere.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
          atmosphere.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
          atmosphere.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.fillStyle = atmosphere;
          ctx.arc(pos.x, pos.y, scaledSize * 2, 0, Math.PI * 2);
          ctx.fill();

          // Add surface details
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.angle;
            const detailX = pos.x + Math.cos(angle) * scaledSize * 0.7;
            const detailY = pos.y + Math.sin(angle) * scaledSize * 0.7;

            const detailGradient = ctx.createRadialGradient(
              detailX,
              detailY,
              0,
              detailX,
              detailY,
              scaledSize * 0.3
            );
            detailGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`);
            detailGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.fillStyle = detailGradient;
            ctx.arc(detailX, detailY, scaledSize * 0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D, pos: ProjectedPosition) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 197, 253, ${
          0.08 * Math.max(0.3, (PERSPECTIVE + pos.z) / (PERSPECTIVE * 2))
        })`;
        ctx.lineWidth = 0.5;

        for (let i = 0; i <= 360; i += 5) {
          const angle = (i * Math.PI) / 180;
          const effectiveRadius =
            this.radius * (1 + Math.sin(angle) * this.orbitEccentricity);
          const x = Math.cos(angle) * effectiveRadius;
          const y = Math.sin(angle) * effectiveRadius;

          const inclinedY =
            y * Math.cos(this.inclination) -
            effectiveRadius * Math.sin(this.inclination) * Math.sin(angle);
          const z =
            y * Math.sin(this.inclination) +
            effectiveRadius * Math.cos(this.inclination) * Math.sin(angle);
          const tiltedY =
            inclinedY * Math.cos(ORBIT_TILT) - z * Math.sin(ORBIT_TILT);
          const finalZ =
            inclinedY * Math.sin(ORBIT_TILT) + z * Math.cos(ORBIT_TILT);

          const projected = this.project(x, tiltedY, finalZ, rotation.get());

          if (i === 0) {
            ctx.moveTo(projected.x, projected.y);
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        }
        ctx.stroke();

        const sortedTrailPoints = [...this.trailPoints]
          .map((point) => ({
            ...point,
            projected: this.project(point.x, point.y, point.z, rotation.get()),
          }))
          .sort((a, b) => b.z - a.z);

        sortedTrailPoints.forEach((point, index) => {
          const { x, y, scale } = point.projected;
          const trailOpacity =
            point.opacity *
            (1 - index / this.trailLength) *
            Math.max(0.3, (PERSPECTIVE + point.z) / (PERSPECTIVE * 2));
          const trailSize =
            this.size * scale * (1 - (index / this.trailLength) * 0.3);

          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            trailSize * 3
          );
          const [r, g, b] = this.hexToRgb(this.color);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${trailOpacity})`);
          gradient.addColorStop(
            0.5,
            `rgba(${r}, ${g}, ${b}, ${trailOpacity * 0.3})`
          );
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(x, y, trailSize * 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw enhanced trail effects
        this.drawTrailEffects(ctx, pos);

        // Draw the planet with enhanced details
        const scaledSize = this.size * pos.scale;
        const mainGradient = ctx.createRadialGradient(
          pos.x,
          pos.y,
          0,
          pos.x,
          pos.y,
          scaledSize * 4
        );

        const [r, g, b] = this.hexToRgb(this.color);
        const depthOpacity =
          pos.opacity *
          Math.max(0.3, (PERSPECTIVE + pos.z) / (PERSPECTIVE * 2));

        mainGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${depthOpacity})`);
        mainGradient.addColorStop(
          0.4,
          `rgba(${r}, ${g}, ${b}, ${depthOpacity * 0.6})`
        );
        mainGradient.addColorStop(
          0.7,
          `rgba(${r}, ${g}, ${b}, ${depthOpacity * 0.2})`
        );
        mainGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.fillStyle = mainGradient;
        ctx.arc(pos.x, pos.y, scaledSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw additional planet details when zoomed in
        this.drawPlanetDetails(ctx, pos);
      }

      hexToRgb(hex: string): [number, number, number] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
            ]
          : [147, 197, 253];
      }
    }

    const initializeOrbitalLights = () => {
      orbitalLights = Array.from(
        { length: orbitalCount },
        (_, i) => new OrbitalLight(i)
      );
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeOrbitalLights();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawSun = (opacity: number = 1) => {
      // Project the sun from world origin (0,0,0) to screen space
      const {
        x: sunX,
        y: sunY,
        scale: sunScale,
      } = new OrbitalLight(0).project(
        0, // World origin X
        0, // World origin Y
        0, // World origin Z
        rotation.get()
      );

      // Outer glow with increased size for better visibility
      const outerGlow = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        SUN_SIZE * 3 * sunScale
      );
      outerGlow.addColorStop(0, `rgba(255, 255, 200, ${0.2 * opacity})`);
      outerGlow.addColorStop(0.5, `rgba(255, 200, 100, ${0.15 * opacity})`);
      outerGlow.addColorStop(1, 'rgba(255, 150, 50, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, SUN_SIZE * 3 * sunScale, 0, Math.PI * 2);
      ctx.fill();

      // Inner sun with enhanced glow
      const sunGradient = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        SUN_SIZE * sunScale
      );
      sunGradient.addColorStop(0, `rgba(255, 255, 200, ${opacity})`);
      sunGradient.addColorStop(0.3, `rgba(255, 200, 100, ${0.8 * opacity})`);
      sunGradient.addColorStop(0.8, `rgba(255, 150, 50, ${0.6 * opacity})`);
      sunGradient.addColorStop(1, 'rgba(255, 150, 50, 0)');

      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, SUN_SIZE * sunScale, 0, Math.PI * 2);
      ctx.fill();

      // Add pulsing core
      const pulseSize =
        SUN_SIZE * 0.7 * (1 + Math.sin(Date.now() * 0.002) * 0.1) * sunScale;
      const coreGradient = ctx.createRadialGradient(
        sunX,
        sunY,
        0,
        sunX,
        sunY,
        pulseSize
      );
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, pulseSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateCamera = (currentPlanet: number) => {
      const camera = cameraRef.current;
      const scrollProgress = scrollYProgress.get();

      // Check if we're in the hero section (first 10% of scroll)
      const isInHeroSection = scrollProgress < 0.1;
      camera.isHeroView = isInHeroSection;

      if (isInHeroSection) {
        // Center view on sun
        camera.targetX = 0;
        camera.targetY = 0;
        camera.targetZ = 0;
        camera.targetZoom = 1;
      } else {
        const planet = orbitalLights[currentPlanet];
        if (!planet) return;

        const pos = planet.update(rotation.get());

        // Offset the camera to keep sun visible in corner
        camera.targetX = pos.x - canvas.width / 2;
        camera.targetY = pos.y - canvas.height / 2;
        camera.targetZ = pos.z;

        // Maintain consistent zoom level regardless of z-position
        const depthFactor = Math.max(
          0.3,
          (PERSPECTIVE + pos.z) / (PERSPECTIVE * 2)
        );
        const dynamicZoom = ZOOM_LEVEL / depthFactor;
        camera.targetZoom = dynamicZoom;
      }

      // Smoothly interpolate camera position with variable lerp speed
      const distanceToTarget = Math.sqrt(
        Math.pow(camera.targetX - camera.x, 2) +
          Math.pow(camera.targetY - camera.y, 2) +
          Math.pow(camera.targetZ - camera.z, 2)
      );

      const adaptiveLerp = CAMERA_LERP * (1 + distanceToTarget / 1000);
      const finalLerp = Math.min(adaptiveLerp, 0.15);

      camera.x += (camera.targetX - camera.x) * finalLerp;
      camera.y += (camera.targetY - camera.y) * finalLerp;
      camera.z += (camera.targetZ - camera.z) * finalLerp;
      camera.zoom += (camera.targetZoom - camera.zoom) * finalLerp;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 9, 19, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scrollProgress = scrollYProgress.get();
      const currentPlanet = Math.floor(
        (scrollProgress - 0.1) * (orbitalCount / 0.9)
      );

      // Update camera to follow current planet or show hero view
      updateCamera(currentPlanet);

      // Get sun's position for occlusion testing
      const sunPos = new OrbitalLight(0).project(0, 0, 0, rotation.get());

      // Sort and draw orbital lights with sun occlusion
      const sortedLights = orbitalLights
        .map((light) => {
          const pos = light.update(rotation.get());

          // Calculate if planet is behind sun using z-position
          const isBehindSun = pos.z < 0;

          // Calculate screen-space distance to sun for radius check
          const dx = pos.x - sunPos.x;
          const dy = pos.y - sunPos.y;
          const distanceToSun = Math.sqrt(dx * dx + dy * dy);

          // Calculate how directly behind the sun the planet is
          const centeredness =
            1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) / (SUN_SIZE * 2));
          const depthBehindSun = Math.abs(pos.z) / 10;

          // Force complete invisibility in a wider area behind sun's center
          if (
            isBehindSun &&
            // Complete invisibility conditions:
            (distanceToSun < SUN_SIZE * 3 || // Close to sun center
              (distanceToSun < SUN_SIZE * 8 && centeredness > 0.3) || // Moderately centered and close
              (distanceToSun < SUN_SIZE * 12 && centeredness > 0.5) || // Very centered but further
              depthBehindSun > 0.3) // Deep behind sun
          ) {
            return { light, pos, occlusionFactor: 0, isBehindSun };
          }

          // Calculate occlusion radius based on planet's orbital radius
          const baseOcclusionRadius = SUN_SIZE * 20;
          const scaledOcclusionRadius =
            baseOcclusionRadius *
            (1 + (light.radius / ORBITAL_CONFIGS.MERCURY.radius) * 2.0);

          // Calculate inner occlusion radius for complete fade
          const innerOcclusionRadius = scaledOcclusionRadius * 0.98;

          // Calculate fade factor based on distance to sun's edge
          let occlusionFactor = 1;
          if (isBehindSun) {
            if (distanceToSun < innerOcclusionRadius) {
              occlusionFactor = 0;
            } else if (distanceToSun < scaledOcclusionRadius) {
              // Fade out gradually in the outer ring
              const distanceFromInner = distanceToSun - innerOcclusionRadius;
              const fadeDistance = scaledOcclusionRadius - innerOcclusionRadius;
              occlusionFactor = Math.min(1, distanceFromInner / fadeDistance);

              // Apply even more aggressive easing
              occlusionFactor = Math.pow(occlusionFactor, 12);

              // Apply additional fade based on z-position
              const zFade = Math.min(1, Math.abs(pos.z) / 10);
              occlusionFactor *= Math.pow(1 - zFade, 8);
            }
          }

          return { light, pos, occlusionFactor, isBehindSun };
        })
        .sort((a, b) => a.pos.z - b.pos.z);

      // Draw planets behind the sun first
      sortedLights.forEach(({ light, pos, occlusionFactor, isBehindSun }) => {
        if (isBehindSun) {
          const modifiedPos = {
            ...pos,
            opacity: pos.opacity * Math.max(0, occlusionFactor),
          };
          light.draw(ctx, modifiedPos);
        }
      });

      // Draw the sun with enhanced glow
      const baseOpacity = 0.3;
      const sunOpacity = Math.max(baseOpacity, 1 - scrollProgress * 5);
      drawSun(sunOpacity);

      // Draw planets in front of the sun
      sortedLights.forEach(({ light, pos, isBehindSun }) => {
        if (!isBehindSun) {
          light.draw(ctx, pos);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rotation, scrollYProgress]);

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 w-full h-full'
      style={{ background: '#000913', pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;
