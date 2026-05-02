"use client";

import React, { useState, useEffect } from 'react';

export default function FlashTenders() {
  const [timeLeft, setTimeLeft] = useState(3540); // 59 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ marginBottom: '40px', background: 'linear-gradient(90deg, #1E1B4B 0%, #312E81 100%)', borderRadius: '16px', padding: '2px' }}>
      <div style={{ background: '#0A0D14', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '15px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
          <i className="fa-solid fa-bolt" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444' }}>FLASH</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>Quick Turnaround: Tech Event Opener</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>$450 FIXED</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF' }}>Need a 15-second energy-filled intro edit for a keynote in 2 hours.</p>
        </div>

        <div style={{ textAlign: 'right', borderLeft: '1px solid #1E2532', paddingLeft: '30px' }}>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Closing In</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '10px', padding: '8px 20px', fontSize: '0.8rem', background: '#ef4444', border: 'none' }}>Quick Bid</button>
        </div>
      </div>
    </div>
  );
}
