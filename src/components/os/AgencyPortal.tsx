"use client";

import React from 'react';
import { MOCK_DATA } from '@/lib/mockData';

export default function AgencyPortal() {
  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.95)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-building-user" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>AGENCY COLLABORATION PORTAL</div>
            <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>INFINITE FRAME AGENCY</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['cr1', 'cr2', 'cr3'].map(id => (
            <div key={id} style={{ width: '25px', height: '25px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {id.toUpperCase()}
            </div>
          ))}
          <div style={{ width: '25px', height: '25px', borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>+</div>
        </div>
      </div>

      {/* Shared Creative Memory */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800, marginBottom: '15px' }}>SHARED CREATIVE MEMORY 🧠🤝</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MOCK_DATA.sharedMemory.map((mem: any) => (
            <div key={mem.id} className="glass-hover" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>{mem.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{mem.value}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8' }}>{mem.votes}</div>
                <div style={{ fontSize: '0.5rem', color: '#6B7280' }}>VOTES</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Direction Voting */}
      <div style={{ padding: '20px', background: 'rgba(129,140,248,0.05)', borderRadius: '16px', border: '1px solid rgba(129,140,248,0.1)' }}>
        <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, marginBottom: '15px' }}>ACTIVE TEAM VOTE: SHADOW DRAFT V2</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ flex: 1, height: '6px', background: '#10b981', borderRadius: '3px' }}></div>
          <div style={{ flex: 0.4, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: '#10b981' }}>72% Accept Hook Alt</span>
          <span style={{ color: '#9CA3AF' }}>3/4 Members Voted</span>
        </div>
      </div>
    </div>
  );
}
