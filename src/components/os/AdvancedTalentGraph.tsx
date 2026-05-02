"use client";

import React, { useState } from 'react';

export default function AdvancedTalentGraph() {
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const clusters = [
    { id: 'retention', label: 'High-Retention Editors', x: 30, y: 30, size: 80, color: '#818cf8', creators: 42 },
    { id: 'conversion', label: 'Conversion Architects', x: 70, y: 60, size: 100, color: '#10b981', creators: 28 },
    { id: 'cinematic', label: 'Visual Moat Builders', x: 50, y: 80, size: 70, color: '#c084fc', creators: 15 },
    { id: 'vfx', label: 'VFX Generalists', x: 20, y: 70, size: 60, color: '#ef4444', creators: 9 }
  ];

  return (
    <div className="glass-card premium-border" style={{ padding: '30px', background: 'rgba(10,13,20,0.95)', height: '600px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>SYSTEM 9: TALENT GRAPH 🌐🧠</div>
        <h3 style={{ fontSize: '1.2rem', color: 'white', margin: '5px 0' }}>Multi-Dimensional Talent Mapping</h3>
        <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Click on a cluster to reveal deep-outcome connections and creator mappings.</p>
      </div>

      {/* SYSTEM 18: Visual Vibe Matcher */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <i className="fa-solid fa-camera-retro" style={{ position: 'absolute', left: '15px', top: '15px', color: '#818cf8' }}></i>
          <input 
            type="text" 
            placeholder="Drop reference clip or type vibe (e.g. 'Cyberpunk Neon')..." 
            style={{ width: '100%', padding: '12px 15px 12px 45px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', fontSize: '0.85rem' }}
          />
        </div>
        <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '12px 20px' }}>
          Analyze Vibe
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '350px', background: 'radial-gradient(circle at center, rgba(129,140,248,0.05) 0%, transparent 70%)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {/* SVG Background Connections */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line x1="30%" y1="30%" x2="70%" y2="60%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="70%" y1="60%" x2="50%" y2="80%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="50%" y1="80%" x2="30%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="20%" y1="70%" x2="30%" y2="30%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>

        {/* Interactive Cluster Nodes */}
        {clusters.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveCluster(c.id)}
            style={{
              position: 'absolute',
              top: `${c.y}%`,
              left: `${c.x}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              background: `radial-gradient(circle, ${c.color} 30%, transparent 100%)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transform: `translate(-50%, -50%) ${activeCluster === c.id ? 'scale(1.2)' : 'scale(1)'}`,
              transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              boxShadow: activeCluster === c.id ? `0 0 50px ${c.color}` : `0 0 20px ${c.color}`,
              opacity: activeCluster && activeCluster !== c.id ? 0.4 : 0.8,
              zIndex: activeCluster === c.id ? 10 : 1
            }}
          >
            <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>{c.creators}</div>
              <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>MODES</div>
            </div>
          </div>
        ))}
        
        {/* Floating Tooltips for Active Cluster */}
        {activeCluster && (
          <div className="animate-fade-in" style={{ position: 'absolute', top: '20px', right: '20px', width: '220px', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '0.8rem', marginBottom: '8px' }}>
              {clusters.find(c => c.id === activeCluster)?.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ fontSize: '0.65rem', color: '#10b981' }}>Avg. Outcome: +22% CTR</div>
              <div style={{ fontSize: '0.65rem', color: '#818cf8' }}>Niche: E-com Performance</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Price Confidence: High</div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.6rem', marginTop: '10px', padding: '6px' }}>View Top Creators</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div className="glass-card" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.6rem', color: '#6B7280', marginBottom: '5px' }}>GLOBAL NODE COUNT</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>12,840</div>
        </div>
        <div className="glass-card" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.6rem', color: '#6B7280', marginBottom: '5px' }}>ACTIVE CLUSTERS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>94</div>
        </div>
        <div className="glass-card" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.6rem', color: '#6B7280', marginBottom: '5px' }}>GRAPH VELOCITY</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>+12%</div>
        </div>
      </div>
    </div>
  );
}
