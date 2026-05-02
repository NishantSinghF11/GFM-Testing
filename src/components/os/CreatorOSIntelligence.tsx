"use client";

import React, { useState } from 'react';
import { GFM_OS } from '@/lib/os';

export default function CreatorOSIntelligence() {
  const prediction = GFM_OS.predictApproval('draft-1');
  const [price, setPrice] = useState(1200);
  const [timeline, setTimeline] = useState(5);
  
  const simulation = GFM_OS.simulateNegotiation({ price, timeline });

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.9)' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fa-solid fa-brain" style={{ color: '#818cf8' }}></i>
        CREATOR INTELLIGENCE SUITE
      </div>

      {/* SYSTEM 4: Approval Prediction */}
      <div style={{ marginBottom: '40px', padding: '20px', background: 'rgba(129,140,248,0.05)', borderRadius: '16px', border: '1px solid rgba(129,140,248,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>APPROVAL LIKELIHOOD</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#818cf8' }}>{prediction.likelihood}%</div>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '10px' }}>AI REASONING</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {prediction.reasons.map((r, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: '#D1D5DB', display: 'flex', gap: '8px' }}>
              <i className="fa-solid fa-check" style={{ color: '#10b981' }}></i>
              {r}
            </div>
          ))}
          {prediction.risks.map((r, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: '#F87171', display: 'flex', gap: '8px' }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM 6: Negotiation Simulator */}
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '20px' }}>NEGOTIATION SIMULATOR 🎭</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '8px' }}>
              <span>Proposed Price</span>
              <span>${price}</span>
            </div>
            <input 
              type="range" min="500" max="3000" step="50" value={price} 
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '8px' }}>
              <span>Timeline (Days)</span>
              <span>{timeline} Days</span>
            </div>
            <input 
              type="range" min="1" max="14" step="1" value={timeline} 
              onChange={(e) => setTimeline(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={{ padding: '15px', background: 'rgba(129,140,248,0.1)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#818cf8', marginBottom: '5px' }}>WIN PROBABILITY</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{simulation.winProbability}%</div>
          </div>
          <div style={{ padding: '15px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#10b981', marginBottom: '5px' }}>CLIENT SATISFACTION</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{simulation.clientSatisfaction}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
