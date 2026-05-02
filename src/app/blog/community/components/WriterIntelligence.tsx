"use client";

import React from 'react';

interface WriterIntelligenceProps {
  posts: any[];
}

export default function WriterIntelligence({ posts }: WriterIntelligenceProps) {
  // Mock performance calculation
  const totalViews = posts.length * 142 + 24;
  const totalLikes = posts.length * 12 + 5;
  const avgEngagement = posts.length > 0 ? (totalLikes / totalViews * 100).toFixed(1) : '0.0';
  
  const stats = [
    { label: 'Total Reach', value: totalViews, icon: 'fa-eye', color: '#6366f1' },
    { label: 'Strategic Likes', value: totalLikes, icon: 'fa-heart', color: '#ec4899' },
    { label: 'Trust Score', value: `${avgEngagement}%`, icon: 'fa-shield-halved', color: '#34d399' },
    { label: 'Global Rank', value: '#12', icon: 'fa-trophy', color: '#f59e0b' }
  ];

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-chart-line" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Performance Intelligence</h3>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: 0 }}>Tracking your strategic impact across the network</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid #4B5563', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', opacity: 0.05, color: stat.color }}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            
            <div style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>{stat.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {stat.value}
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}><i className="fa-solid fa-caret-up"></i> 12%</span>
            </div>
            
            <div style={{ marginTop: '15px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: stat.color, borderRadius: '2px', boxShadow: `0 0 10px ${stat.color}` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
