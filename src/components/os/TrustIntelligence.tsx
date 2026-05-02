"use client";

import React from 'react';

export default function TrustIntelligence() {
  const trustEvents = [
    { date: '2026-04-28', type: 'Early Delivery', impact: 'positive', description: 'Project delivered 2 days before deadline.' },
    { date: '2026-04-15', type: 'Zero Revision', impact: 'positive', description: 'V1 accepted without any changes.' },
    { date: '2026-03-22', type: 'Dispute Resolved', impact: 'neutral', description: 'Minor scope disagreement settled via AI Mediation.' }
  ];

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.9)' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fa-solid fa-shield-heart" style={{ color: '#ef4444' }}></i>
        TRUST & RESOLUTION ENGINE
      </div>

      {/* SYSTEM 15: Trust Ledger */}
      <div style={{ marginBottom: '35px' }}>
        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px', textTransform: 'uppercase' }}>Immutable Trust Ledger 📜🔐</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trustEvents.map((event, i) => (
            <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>{event.type}</span>
                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{event.date}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{event.description}</div>
              <div style={{ marginTop: '10px', height: '2px', width: '100%', background: event.impact === 'positive' ? '#10b981' : '#f59e0b', opacity: 0.3 }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM 10: Creative Arbitration AI */}
      <div style={{ padding: '25px', background: 'rgba(239,68,68,0.05)', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <i className="fa-solid fa-scale-balanced" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>
          <span style={{ fontWeight: 800, color: 'white', fontSize: '0.85rem', textTransform: 'uppercase' }}>AI Dispute Intelligence</span>
        </div>
        
        <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: '8px' }}>NEUTRAL REASONING:</div>
          <p style={{ fontSize: '0.75rem', color: '#D1D5DB', lineHeight: 1.5 }}>
            "The deliverables match 92% of the initial technical brief. The remaining 8% relates to 'Vibe' which is subjective. Suggested resolution: Release 90% of funds immediately; remaining 10% held for one final style tweak."
          </p>
        </div>
        
        <button className="btn btn-primary" style={{ width: '100%', background: '#ef4444', fontSize: '0.8rem' }}>
          Accept Neutral Resolution
        </button>
      </div>
    </div>
  );
}
