"use client";

import React, { useState, useEffect } from 'react';

export default function ProgressNebula({ progress }: { progress: number }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central Nebula Cloud */}
      <div style={{
        position: 'absolute',
        width: `${progress * 1.5 + 50}px`,
        height: `${progress * 1.5 + 50}px`,
        background: `radial-gradient(circle, #818cf8 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(30px)',
        opacity: 0.4,
        transition: 'all 0.5s ease-out',
        animation: pulse ? 'pulse-nebula 4s ease-in-out infinite' : 'none'
      }} />

      {/* Progress Ring */}
      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
          fill="transparent"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          stroke="#818cf8"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray="502.4"
          strokeDashoffset={502.4 - (502.4 * progress) / 100}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', strokeLinecap: 'round' }}
        />
      </svg>

      {/* Stats */}
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>{Math.round(progress)}%</div>
        <div style={{ fontSize: '0.6rem', color: '#818cf8', fontWeight: 800 }}>QUANTUM DELIVERY</div>
      </div>

      <style jsx>{`
        @keyframes pulse-nebula {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
