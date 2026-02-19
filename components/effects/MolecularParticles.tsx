'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  element: 'H' | 'C' | 'O' | 'N';
}

const ELEMENT_COLORS = {
  H: '#e5e7eb', // White/Gray
  C: '#a855f7', // Purple
  O: '#ef4444', // Red
  N: '#3b82f6', // Blue
};

const ELEMENT_SIZES = {
  H: 2,
  C: 3.5,
  O: 3,
  N: 3,
};

export default function MolecularParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number | undefined>(undefined);

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(40, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];
    const elements: Array<'H' | 'C' | 'O' | 'N'> = ['H', 'C', 'O', 'N', 'C', 'N', 'H', 'O'];

    for (let i = 0; i < particleCount; i++) {
      const element = elements[i % elements.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: ELEMENT_SIZES[element],
        color: ELEMENT_COLORS[element],
        element,
      });
    }
    particlesRef.current = particles;
  }, []); // Added empty dependency array

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Gentle drift
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < -50) particle.x = width + 50;
        if (particle.x > width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = height + 50;
        if (particle.y > height + 50) particle.y = -50;

        // Mouse repulsion (subtle)
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.02;
          particle.vx -= (dx / dist) * force;
          particle.vy -= (dy / dist) * force;
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + '20';
        ctx.fill();

        // Draw bonds to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const bondDx = other.x - particle.x;
          const bondDy = other.y - particle.y;
          const bondDist = Math.sqrt(bondDx * bondDx + bondDy * bondDy);

          if (bondDist < 120) {
            const opacity = (1 - bondDist / 120) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
