"use client";

import React, { useState, useEffect } from 'react';

export default function MarketTicker() {
  const [events] = useState([
    { id: 1, text: "New $2,500 Cinematic Tender launched in 'Video Production'", icon: "fa-bullhorn", color: "#818cf8" },
    { id: 2, text: "Creator 'Rivera' unlocked 'Teal & Orange' Mastery Badge", icon: "fa-medal", color: "#f59e0b" },
    { id: 3, text: "$1,200 Milestone released via GFM Vault for 'Urban Music Video'", icon: "fa-lock-open", color: "#10b981" },
    { id: 4, text: "AI Matchmaker: 98% Confidence pair made for '3D Animation' project", icon: "fa-brain", color: "#c084fc" },
    { id: 5, text: "Flash Tender: $500 Logo Edit closing in 12 minutes", icon: "fa-bolt", color: "#ef4444" }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <div style={{ 
      background: 'rgba(10,13,20,0.8)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      padding: '8px 20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      overflow: 'hidden',
      height: '40px',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    }}>
      <div style={{ 
        fontSize: '0.65rem', 
        fontWeight: 900, 
        color: '#818cf8', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        whiteSpace: 'nowrap',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        paddingRight: '20px'
      }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
        Live Market Pulse
      </div>

      <div style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
        {events.map((event, idx) => (
          <div 
            key={event.id}
            style={{ 
              position: 'absolute',
              left: 0,
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '0.8rem',
              color: '#D1D5DB',
              opacity: currentIndex === idx ? 1 : 0,
              transform: currentIndex === idx ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s ease-in-out',
              pointerEvents: currentIndex === idx ? 'auto' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <i className={`fa-solid ${event.icon}`} style={{ color: event.color }}></i>
            <span>{event.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.7rem', color: '#6B7280', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa-solid fa-circle" style={{ color: '#10b981', fontSize: '0.4rem' }}></i>
          1,242 Online
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa-solid fa-chart-line" style={{ color: '#818cf8' }}></i>
          $42.5k Vol
        </span>
      </div>
    </div>
  );
}
