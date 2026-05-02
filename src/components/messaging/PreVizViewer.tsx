"use client";

import React, { useState } from 'react';

interface PreVizFrame {
  id: string;
  url: string;
  label: string;
}

interface PreVizViewerProps {
  frames: PreVizFrame[];
  styleDirection: string;
  onApprove: () => void;
  onReject: () => void;
}

export default function PreVizViewer({ frames, styleDirection, onApprove, onReject }: PreVizViewerProps) {
  const [activeFrame, setActiveFrame] = useState(frames[0]);

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.95)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '20px', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8' }}></i>
        <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Pre-Viz Storyboard</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>DRAFT READY</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={activeFrame.url} alt={activeFrame.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
            {activeFrame.label}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '25px' }}>
        {frames.map(frame => (
          <div 
            key={frame.id} 
            onClick={() => setActiveFrame(frame)}
            style={{ 
              aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', 
              border: activeFrame.id === frame.id ? '2px solid #818cf8' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <img src={frame.url} alt={frame.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '25px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px' }}>Visual Direction</div>
        <p style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
          {styleDirection}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button onClick={onReject} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>Suggest Changes</button>
        <button onClick={onApprove} className="btn btn-primary animate-shimmer" style={{ flex: 1, fontSize: '0.85rem' }}>Confirm Visual Vibe</button>
      </div>
    </div>
  );
}
