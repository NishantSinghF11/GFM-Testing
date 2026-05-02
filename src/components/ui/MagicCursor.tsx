"use client";

import React, { useEffect, useState } from 'react';

export default function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      
      // Update global CSS variables for the background aura
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVisible]);

  // Delayed following for the ring
  useEffect(() => {
    const followMouse = () => {
      setRingPosition(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15
      }));
      requestAnimationFrame(followMouse);
    };
    const anim = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(anim);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* THE MAIN POINT */}
      <div 
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: '6px',
          height: '6px',
          background: '#818cf8',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px #818cf8, 0 0 20px rgba(129, 140, 248, 0.5)',
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* THE MAGIC RING */}
      <div 
        style={{
          position: 'fixed',
          top: ringPosition.y,
          left: ringPosition.x,
          width: isClicked ? '30px' : '40px',
          height: isClicked ? '30px' : '40px',
          border: '1.5px solid rgba(129, 140, 248, 0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
          background: isClicked ? 'rgba(129, 140, 248, 0.1)' : 'transparent',
          boxShadow: isClicked ? '0 0 20px rgba(129, 140, 248, 0.2)' : 'none'
        }}
      />

      {/* THE ATMOSPHERIC AURA */}
      <div 
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)'
        }}
      />

      <style jsx global>{`
        body, a, button, input {
          cursor: none !important;
        }
        /* Restore cursor for selection if needed, or keep it hidden for immersion */
        ::selection {
          background: rgba(129, 140, 248, 0.3);
        }
      `}</style>
    </>
  );
}
