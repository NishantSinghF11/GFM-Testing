"use client";

import React, { useState, useEffect } from 'react';

const SKILLS = ['VFX', '3D Modeling', 'Cinematography', 'UI/UX', 'Motion Graphics', 'Color Grading', 'Sound Design', 'Scripting'];

export default function LiveIntelligenceDashboard() {
  const [marketIndex, setMarketIndex] = useState(1240.50);
  const [indexChange, setIndexChange] = useState(1.2);
  const [activeSignals, setActiveSignals] = useState<number[]>([]);
  
  useEffect(() => {
    // Simulate live market fluctuations
    const interval = setInterval(() => {
      setMarketIndex(prev => prev + (Math.random() - 0.45) * 2);
      setIndexChange(prev => prev + (Math.random() - 0.5) * 0.1);
      
      // Randomly pulse a skill node
      const randomIdx = Math.floor(Math.random() * SKILLS.length);
      setActiveSignals(prev => [...prev, randomIdx].slice(-3));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card" style={{ padding: '35px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#6B7280', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>GFM Global Market Index</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{marketIndex.toFixed(2)}</span>
            <div style={{ color: indexChange >= 0 ? '#10b981' : '#ef4444', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className={`fa-solid fa-caret-${indexChange >= 0 ? 'up' : 'down'}`}></i>
              {Math.abs(indexChange).toFixed(2)}%
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginBottom: '5px' }}>● LIVE SIGNALS</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>4,812 / SEC</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* SKILL HEATMAP */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}>Skill Demand Heatmap</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {SKILLS.map((skill, i) => {
              const isActive = activeSignals.includes(i);
              return (
                <div 
                  key={skill} 
                  style={{ 
                    height: '80px', 
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.02)', 
                    border: isActive ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isActive && (
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', animation: 'pulse 2s infinite' }}></div>
                  )}
                  <div style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 800, marginBottom: '4px', textAlign: 'center' }}>{skill}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{Math.floor(Math.random() * 40 + 60)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OPPORTUNITY RADAR */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', width: '100%' }}>Opportunity Radar</div>
          <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.1)' }}></div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.1)' }}></div>
            <div style={{ position: 'absolute', width: '1px', height: '100%', background: 'linear-gradient(to top, transparent, rgba(16,185,129,0.3), transparent)', animation: 'rotate 4s linear infinite' }}></div>
            
            {/* OPPORTUNITY DOTS */}
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
            <div style={{ position: 'absolute', top: '60%', left: '80%', width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 10px #f59e0b' }}></div>
            <div style={{ position: 'absolute', top: '40%', left: '10%', width: '5px', height: '5px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 10px #818cf8' }}></div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div> High Budget</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div> Trending</div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
