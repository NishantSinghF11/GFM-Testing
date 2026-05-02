"use client";

import React, { useState } from 'react';

export default function ShadowDraftViewer() {
  const [direction, setDirection] = useState<'original' | 'hook_alt' | 'mood_shift' | 'viral'>('original');

  const directions = [
    { id: 'original', label: 'Original Edit', icon: 'fa-clapperboard', description: 'The creator\'s vision as submitted.' },
    { id: 'hook_alt', label: 'AI Hook Alt', icon: 'fa-wand-sparkles', description: 'Alternate 3-second intro to boost retention.' },
    { id: 'mood_shift', label: 'Mood Shift', icon: 'fa-palette', description: 'Re-graded in "Noir" style using AI metadata.' },
    { id: 'viral', label: 'Viral Pacing', icon: 'fa-bolt', description: 'AI-retimed cuts for high-velocity social platforms.' }
  ];

  return (
    <div className="glass-card premium-border" style={{ padding: '30px', background: 'rgba(10,13,20,0.95)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>SYSTEM 14: SHADOW DRAFTS 👁️🗨️</div>
          <h3 style={{ fontSize: '1.2rem', color: 'white', margin: '5px 0' }}>Direction Branching UI</h3>
        </div>
        <div style={{ background: 'rgba(129,140,248,0.2)', color: '#818cf8', fontSize: '0.7rem', padding: '5px 12px', borderRadius: '20px', fontWeight: 700 }}>AI PRE-RENDERED</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '30px' }}>
        {/* Main Player Area */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRation: '16/9', background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Mock Video Placeholder */}
          <div style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <i className={`fa-solid ${directions.find(d => d.id === direction)?.icon} fa-4x`} style={{ color: '#818cf8', opacity: 0.5, marginBottom: '20px' }}></i>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Viewing: {directions.find(d => d.id === direction)?.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '10px' }}>Simulating {direction} playback...</div>
            </div>
            
            {/* Split-screen indicator if not original */}
            {direction !== 'original' && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', borderRight: '2px solid #818cf8', background: 'rgba(129,140,248,0.05)', display: 'flex', alignItems: 'flex-end', padding: '20px' }}>
                <span style={{ fontSize: '0.65rem', background: '#818cf8', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>ORIGINAL</span>
              </div>
            )}
          </div>
          
          {/* Player Controls */}
          <div style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <i className="fa-solid fa-play"></i>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
              <div style={{ width: '40%', height: '100%', background: '#818cf8' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>00:24 / 01:00</span>
          </div>

          {/* SYSTEM 19: Audience Simulation Stats */}
          <div style={{ padding: '15px 20px', background: 'rgba(16,185,129,0.05)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800 }}>SIMULATED RETENTION</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'white' }}>84%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#818cf8', fontWeight: 800 }}>CTR POTENTIAL</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'white' }}>9.2%</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>SENTIMENT</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>POSITIVE</div>
            </div>
          </div>
        </div>

        {/* Direction Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {directions.map((d) => (
            <button
              key={d.id}
              onClick={() => setDirection(d.id as any)}
              className="glass-hover"
              style={{
                textAlign: 'left',
                padding: '15px',
                borderRadius: '12px',
                background: direction === d.id ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.02)',
                border: direction === d.id ? '1px solid rgba(129,140,248,0.3)' : '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <i className={`fa-solid ${d.icon}`} style={{ color: direction === d.id ? '#818cf8' : '#6B7280' }}></i>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: direction === d.id ? 'white' : '#9CA3AF' }}>{d.label}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: direction === d.id ? '#9CA3AF' : '#6B7280', lineHeight: 1.4 }}>{d.description}</div>
            </button>
          ))}
          
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(192,132,252,0.05)', borderRadius: '12px', border: '1px solid rgba(192,132,252,0.1)', fontSize: '0.7rem', color: '#D1D5DB' }}>
            <i className="fa-solid fa-lightbulb" style={{ color: '#c084fc', marginRight: '8px' }}></i>
            <strong>PRO TIP:</strong> Clients use Shadow Drafts to test alternate hooks before requesting full revisions.
          </div>
        </div>
      </div>
    </div>
  );
}
