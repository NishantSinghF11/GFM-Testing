"use client";

import React from 'react';

interface VerifiedBadgeProps {
  level?: string;
  size?: number;
}

export default function VerifiedBadge({ level = 'Strategic Expert', size = 16 }: VerifiedBadgeProps) {
  return (
    <div 
      className="verified-badge"
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginLeft: '6px',
        position: 'relative',
        cursor: 'help'
      }}
      title={level}
    >
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(135deg, #6366f1, #34d399)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(99,102,241,0.5)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <i className="fa-solid fa-check" style={{ color: 'white', fontSize: `${size * 0.6}px` }}></i>
      </div>
      
      <style jsx>{`
        .verified-badge:hover div {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(52,211,153,0.6);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
