"use client";

import React, { useEffect, useState } from 'react';

export default function MarketPulseCore() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer Rings */}
      <div className={`pulse-ring ${pulse ? 'active' : ''}`} style={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '50%' }}></div>
      <div className={`pulse-ring ${pulse ? 'active' : ''}`} style={{ position: 'absolute', width: '80%', height: '80%', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '50%', animationDelay: '0.5s' }}></div>
      
      {/* The Core */}
      <div style={{ 
        width: '80px', 
        height: '80px', 
        background: 'radial-gradient(circle, #818cf8 0%, #4338ca 100%)', 
        borderRadius: '50%', 
        boxShadow: '0 0 50px rgba(129,140,248,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        animation: 'float 4s ease-in-out infinite'
      }}>
        <i className="fa-solid fa-bolt" style={{ color: 'white', fontSize: '1.5rem' }}></i>
      </div>

      {/* Floating Data Nodes */}
      <div className="pulse-node" style={{ top: '10%', left: '20%', animationDelay: '1s' }}>
        <div style={{ fontSize: '0.6rem', color: '#10b981' }}>DEAL STRUCK</div>
        <div style={{ fontSize: '0.5rem', color: '#9CA3AF' }}>$1,200 Bali Reel</div>
      </div>
      <div className="pulse-node" style={{ top: '70%', right: '10%', animationDelay: '2.5s' }}>
        <div style={{ fontSize: '0.6rem', color: '#818cf8' }}>SCOUT MATCH</div>
        <div style={{ fontSize: '0.5rem', color: '#9CA3AF' }}>Alex R. Found</div>
      </div>
      <div className="pulse-node" style={{ bottom: '15%', left: '15%', animationDelay: '4s' }}>
        <div style={{ fontSize: '0.6rem', color: '#f59e0b' }}>ALPHA DETECTED</div>
        <div style={{ fontSize: '0.5rem', color: '#9CA3AF' }}>Claymation +12%</div>
      </div>

      <style jsx>{`
        .pulse-ring {
          opacity: 0;
          transform: scale(0.5);
          transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pulse-ring.active {
          opacity: 1;
          transform: scale(1.5);
          opacity: 0;
        }
        .pulse-node {
          position: absolute;
          padding: 8px 12px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          animation: float 6s ease-in-out infinite;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
