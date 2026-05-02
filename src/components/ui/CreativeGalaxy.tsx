"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';

export default function CreativeGalaxy() {
  const [scrollPos, setScrollPos] = useState(0);
  const [mounted, setMounted] = useState(false);
  const galaxyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Use useMemo to stabilize random values on the client
  const auras = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 160 - 80,
      y: Math.random() * 160 - 80,
      z: Math.random() * 3000 - 1500,
      size: Math.random() * 400 + 300,
      color: i % 3 === 0 ? 'rgba(129,140,248,0.08)' : i % 3 === 1 ? 'rgba(16,185,129,0.08)' : 'rgba(192,132,252,0.08)'
    }));
  }, [mounted]);

  // Prevent SSR/Hydration mismatch by returning basic container first
  if (!mounted) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#05070A', zIndex: -1 }} />
    );
  }

  return (
    <div 
      ref={galaxyRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#05070A',
        overflow: 'hidden',
        zIndex: -1,
        perspective: '1500px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Soft Auras */}
        {auras.map(a => {
          const depthOpacity = Math.max(0.2, 1 - Math.abs(a.z) / 2000);
          return (
            <div 
              key={a.id}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${a.size}px`,
                height: `${a.size}px`,
                background: `radial-gradient(circle, ${a.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: depthOpacity,
                transform: `translateX(${a.x}vw) translateY(${a.y}vh) translateZ(${a.z}px)`
              }}
            />
          );
        })}
      </div>

      {/* Global Vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 0%, rgba(5,7,10,0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
