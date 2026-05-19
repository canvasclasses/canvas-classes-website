'use client';

import { useRef, useCallback } from 'react';

interface MagneticOptions {
  strength?: number;
  radius?: number;
  ease?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 100, ease = 0.15 } = options;
  const elementRef = useRef<HTMLElement | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const element = elementRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      const force = (radius - distance) / radius;
      positionRef.current = {
        x: distX * strength * force,
        y: distY * strength * force,
      };
    } else {
      positionRef.current = { x: 0, y: 0 };
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      element.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    });
  }, [strength, radius]);

  const handleMouseLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const animate = () => {
      positionRef.current.x *= (1 - ease);
      positionRef.current.y *= (1 - ease);

      element.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;

      if (Math.abs(positionRef.current.x) > 0.1 || Math.abs(positionRef.current.y) > 0.1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        element.style.transform = '';
      }
    };

    animate();
  }, [ease]);

  const bindMagnetic = useCallback((element: HTMLElement | null) => {
    if (!element) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    elementRef.current = element;
    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { bindMagnetic, ref: elementRef };
}
