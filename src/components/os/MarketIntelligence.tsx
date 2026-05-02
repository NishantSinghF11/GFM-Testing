"use client";

import React from 'react';

export default function MarketIntelligence() {
  const trends = [
    { label: 'Grainy Y2K Aesthetic', growth: '+124%', alpha: true },
    { label: 'Hyper-Dynamic Cuts', growth: '+82%', alpha: false },
    { label: 'Lo-Fi Branding', growth: '+45%', alpha: false }
  ];

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.9)' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fa-solid fa-earth-americas" style={{ color: '#10b981' }}></i>
        MARKET & TALENT GRAPH
      </div>

      {/* SYSTEM 16: Talent Scout Agent */}
      <div style={{ marginBottom: '35px', padding: '20px', background: 'rgba(129,140,248,0.05)', borderRadius: '16px', border: '1px solid rgba(129,140,248,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800 }}>ACTIVE TALENT SCOUT 🕵️‍♂️</div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-user-check" style={{ color: '#818cf8' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>Alex Rivera Found</div>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Matches "High-Retention" outcome target (+32% CTR).</div>
          </div>
        </div>
      </div>

      {/* SYSTEM 13: Creative Alpha Feed */}
      <div style={{ marginBottom: '35px' }}>
        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px', textTransform: 'uppercase' }}>Creative Alpha Feed 📈</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trends.map((trend, i) => (
            <div key={i} className="glass-hover" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>{trend.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981' }}>Trending {trend.growth}</div>
              </div>
              {trend.alpha && (
                <div style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 800 }}>ALPHA</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM 20: Alpha Aesthetic Radar */}
      <div style={{ marginBottom: '35px', padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.1)' }}>
        <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800, marginBottom: '15px' }}>ALPHA RADAR: AESTHETIC ARBITRAGE 📡</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'white' }}>Hyper-Realistic 3D Claymation</div>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Demand Surge: +410% | Supply Shortage</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#10b981' }}>8.2x</div>
            <div style={{ fontSize: '0.6rem', color: '#6B7280' }}>VALUE INDEX</div>
          </div>
        </div>
      </div>

      {/* SYSTEM 9: Talent Graph (Simplified Visualization) */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px', textTransform: 'uppercase' }}>Talent Cluster Graph 🌐</div>
        <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Mock Nodes */}
          <div style={{ position: 'absolute', top: '30%', left: '20%', width: '12px', height: '12px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 15px #818cf8' }}></div>
          <div style={{ position: 'absolute', top: '60%', left: '40%', width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
          <div style={{ position: 'absolute', top: '40%', left: '70%', width: '14px', height: '14px', background: '#c084fc', borderRadius: '50%', boxShadow: '0 0 20px #c084fc' }}></div>
          
          {/* Connection Lines (Mock) */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2 }}>
            <line x1="20%" y1="30%" x2="40%" y2="60%" stroke="white" strokeWidth="1" />
            <line x1="40%" y1="60%" x2="70%" y2="40%" stroke="white" strokeWidth="1" />
          </svg>
          
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', fontSize: '0.65rem', color: '#6B7280' }}>
            Mapping 12,000+ style relationships...
          </div>
        </div>
      </div>

      {/* SYSTEM 12: Outcome-Based Hiring */}
      <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)' }}>
        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '10px' }}>HIRE BY OUTCOME</div>
        <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '15px' }}>Match with creators based on verified performance metrics.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '8px' }}>+15% Retention</button>
          <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '8px' }}>Top 5% CTR</button>
        </div>
      </div>
    </div>
  );
}
