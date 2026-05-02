"use client";

import React from 'react';

interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
  reason: string;
}

export default function NicheMastery() {
  const badges: Badge[] = [
    { id: 'b1', label: 'Teal & Orange Specialist', icon: 'fa-palette', color: '#0ea5e9', reason: 'High success rate on travel-themed projects.' },
    { id: 'b2', label: 'Fast-Paced Editor', icon: 'fa-bolt', color: '#f59e0b', reason: 'Consistently delivers 24h ahead of schedule.' },
    { id: 'b3', label: 'High-Retention Storyteller', icon: 'fa-brain', color: '#818cf8', reason: 'AI analysis detects 95% hook efficiency.' }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fa-solid fa-medal" style={{ color: '#818cf8' }}></i>
        AI-Verified Niche Mastery
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {badges.map(badge => (
          <div key={badge.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = badge.color}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${badge.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color }}>
              <i className={`fa-solid ${badge.icon}`}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{badge.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{badge.reason}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
