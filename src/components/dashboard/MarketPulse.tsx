"use client";

import React from 'react';

export default function MarketPulse() {
  const trends = [
    { skill: 'Cyberpunk VFX', demand: 'Surging', growth: '+45%', color: '#f472b6' },
    { skill: 'Minimalist UI', demand: 'High', growth: '+12%', color: '#818cf8' },
    { skill: 'Vertical Video Ads', demand: 'Extreme', growth: '+120%', color: '#10b981' },
    { skill: '3D Product Loops', demand: 'Rising', growth: '+30%', color: '#f59e0b' }
  ];

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.8)', border: '1px solid rgba(16,185,129,0.3)', marginTop: '30px', animation: 'fadeIn 0.6s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <i className="fa-solid fa-chart-line" style={{ color: '#10b981' }}></i>
        <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Global Market Pulse</h3>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>LIVE DATA</span>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '25px', lineHeight: 1.5 }}>
        Real-time visualization of creative capital flow. Use these insights to pivot your skills to high-demand niches.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {trends.map(trend => (
          <div key={trend.skill}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{trend.skill}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: trend.color }}>{trend.growth}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: trend.growth.replace('+', ''), 
                  background: `linear-gradient(90deg, ${trend.color}44, ${trend.color})`, 
                  borderRadius: '3px',
                  boxShadow: `0 0 10px ${trend.color}33`
                }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Demand: {trend.demand}</span>
              <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Volume: 1.2k deals/mo</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)', fontSize: '0.75rem', color: '#D1D5DB' }}>
        <i className="fa-solid fa-lightbulb" style={{ color: '#10b981', marginRight: '8px' }}></i>
        <strong>Opportunity:</strong> High demand for <strong>Vertical Video</strong> in the <strong>Tech</strong> sector. Consider updating your portfolio.
      </div>
    </div>
  );
}
