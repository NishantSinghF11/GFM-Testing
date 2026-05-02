"use client";

import React, { useState } from 'react';
import { GFM_OS, ProjectEvent, DriftScore } from '@/lib/os';
import { MOCK_DATA } from '@/lib/mockData';

export default function CreativeOSIntelligence() {
  const [activeTab, setActiveTab] = useState<'replay' | 'drift' | 'scope' | 'ghost'>('replay');
  const drift = GFM_OS.calculateDrift({}, {});

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.9)', minHeight: '500px' }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
        <button 
          onClick={() => setActiveTab('replay')}
          style={{ color: activeTab === 'replay' ? '#818cf8' : '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          OS Replay
        </button>
        <button 
          onClick={() => setActiveTab('drift')}
          style={{ color: activeTab === 'drift' ? '#818cf8' : '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Drift Detector
        </button>
        <button 
          onClick={() => setActiveTab('scope')}
          style={{ color: activeTab === 'scope' ? '#818cf8' : '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Scope Firewall
        </button>
        <button 
          onClick={() => setActiveTab('ghost')}
          style={{ color: activeTab === 'ghost' ? '#818cf8' : '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Ghost PM 👻
        </button>
      </div>

      {activeTab === 'replay' && (
        <div className="animate-fade-in">
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '20px' }}>PROJECT TIME MACHINE ⏪</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '2px solid rgba(129,140,248,0.2)', paddingLeft: '20px' }}>
            {MOCK_DATA.projectEvents.map((event: any) => (
              <div key={event.id} className="glass-hover" style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-27px', top: '15px', width: '12px', height: '12px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
                <div style={{ fontSize: '0.65rem', color: '#818cf8', marginBottom: '5px' }}>{new Date(event.timestamp).toLocaleDateString()}</div>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: '5px' }}>{event.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'drift' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(99,102,241,0.05)', borderRadius: '50%', width: '180px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '4px solid rgba(99,102,241,0.1)', margin: '0 auto' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8' }}>{drift.overall}%</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Current Drift</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {Object.entries(drift.factors).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '5px', textTransform: 'capitalize' }}>
                    <span>{key} Alignment</span>
                    <span>{100-val}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${100-val}%`, background: '#818cf8' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)', fontSize: '0.8rem', color: '#D1D5DB' }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '10px' }}></i>
            The project is currently <strong>well-aligned</strong>. Style and Tone are within safe thresholds.
          </div>
        </div>
      )}

      {activeTab === 'scope' && (
        <div className="animate-fade-in">
          <div style={{ padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>Scope Variance Detected (22%)</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>
              The last request for "4K Cinematic Master Export" exceeds the original milestone scope.
            </p>
          </div>
          
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px' }}>SUGGESTED ACTIONS</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem' }}>Clarify Scope</button>
            <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Create Add-on ($150)</button>
          </div>
        </div>
      )}

      {activeTab === 'ghost' && (
        <div className="animate-fade-in">
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>GHOST PM STATUS: ACTIVE</div>
              <div style={{ background: '#10b981', width: '6px', height: '6px', borderRadius: '50%' }}></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '12px', background: 'rgba(129,140,248,0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', marginBottom: '5px' }}>Next Smart Step:</div>
                <div style={{ fontSize: '0.85rem', color: 'white' }}>"Auto-sorting Bali export metadata into GFM Vault..."</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>ACTIVE NUDGES</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>2</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: '#9CA3AF' }}>VAULT HEALTH</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>98%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px' }}>AUTONOMOUS LOG</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>[09:42] GhostPM: Nudged creator for V2 status update.</div>
            <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>[08:15] GhostPM: Consolidated feedback from 3 stakeholders into chat summary.</div>
          </div>
        </div>
      )}
    </div>
  );
}
