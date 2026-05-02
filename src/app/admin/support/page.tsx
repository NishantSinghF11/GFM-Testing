"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Ticket {
  id: string;
  refId: string;
  user: string;
  type: 'Report' | 'Safety Inquiry';
  category: string;
  status: 'pending' | 'reviewing' | 'resolved';
  timestamp: string;
  content: string;
}

export default function AdminSupportDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', refId: 'GFM-REP-XJ92K', user: 'alex_visuals', type: 'Report', category: 'Payment Dispute', status: 'pending', timestamp: '2 hours ago', content: 'Client is refusing to release funds for milestone 2 despite delivery.' },
    { id: '2', refId: 'GFM-SAFE-LT102', user: 'studio_k', type: 'Safety Inquiry', category: 'Account Security', status: 'reviewing', timestamp: '5 hours ago', content: 'Suspected unauthorized login attempt from an unknown IP.' },
    { id: '3', refId: 'GFM-REP-BP441', user: 'vfx_pro', type: 'Report', category: 'Scam/Spam', status: 'resolved', timestamp: '1 day ago', content: 'User sent a phishing link disguised as a creative brief.' },
    { id: '4', refId: 'GFM-REP-NZ882', user: 'indie_director', type: 'Report', category: 'Harassment', status: 'pending', timestamp: '10 mins ago', content: 'Verbal abuse in private messages regarding project timeline.' },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'resolved'>('all');

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  const updateStatus = (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTicket(null);
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'pending': return '#ef4444';
      case 'reviewing': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#9CA3AF';
    }
  };

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', padding: '6px 12px', borderRadius: '20px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginBottom: '15px', letterSpacing: '1px' }}>
              <i className="fa-solid fa-shield-halved"></i> SAFETY COMMAND CENTER
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>Support <span className="text-gradient">Intelligence</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'pending', 'reviewing', 'resolved'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f as any)} 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid #1E2532', 
                  background: filter === f ? '#818cf8' : 'rgba(255,255,255,0.02)',
                  color: filter === f ? 'white' : '#9CA3AF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* TICKET LIST */}
        <div className="glass-card" style={{ borderRadius: '24px', border: '1px solid #1E2532', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid #1E2532' }}>
                <th style={{ padding: '20px 30px', fontSize: '0.8rem', color: '#6B7280' }}>REFERENCE ID</th>
                <th style={{ padding: '20px', fontSize: '0.8rem', color: '#6B7280' }}>USER</th>
                <th style={{ padding: '20px', fontSize: '0.8rem', color: '#6B7280' }}>CATEGORY</th>
                <th style={{ padding: '20px', fontSize: '0.8rem', color: '#6B7280' }}>STATUS</th>
                <th style={{ padding: '20px', fontSize: '0.8rem', color: '#6B7280' }}>TIMESTAMP</th>
                <th style={{ padding: '20px 30px', fontSize: '0.8rem', color: '#6B7280', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1E2532', transition: 'background 0.2s' }}>
                  <td style={{ padding: '25px 30px', fontWeight: 800, fontFamily: 'monospace', color: '#818cf8' }}>{t.refId}</td>
                  <td style={{ padding: '20px', fontSize: '0.9rem' }}>@{t.user}</td>
                  <td style={{ padding: '20px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', color: '#9CA3AF' }}>{t.type}</span>
                      {t.category}
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${getStatusColor(t.status)}15`, color: getStatusColor(t.status), padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      <div style={{ width: '6px', height: '6px', background: getStatusColor(t.status), borderRadius: '50%' }}></div>
                      {t.status}
                    </div>
                  </td>
                  <td style={{ padding: '20px', fontSize: '0.85rem', color: '#6B7280' }}>{t.timestamp}</td>
                  <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                    <button onClick={() => setSelectedTicket(t)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INSPECTION MODAL */}
        {selectedTicket && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, marginBottom: '5px' }}>{selectedTicket.refId}</div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Ticket <span className="text-gradient">Inspection</span></h2>
                </div>
                <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: '#4B5563', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #1E2532' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', marginBottom: '4px' }}>SUBMITTED BY</div>
                  <div style={{ fontWeight: 700 }}>@{selectedTicket.user}</div>
                </div>
                <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #1E2532' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', marginBottom: '4px' }}>INCIDENT TYPE</div>
                  <div style={{ fontWeight: 700 }}>{selectedTicket.category}</div>
                </div>
              </div>

              <div style={{ marginBottom: '35px' }}>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', marginBottom: '10px', fontWeight: 800 }}>DETAILED CONTENT</div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid #1E2532', color: '#D1D5DB', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selectedTicket.content}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => updateStatus(selectedTicket.id, 'reviewing')} className="btn btn-outline" style={{ flex: 1, color: '#f59e0b', borderColor: '#f59e0b' }}>Set to Reviewing</button>
                <button onClick={() => updateStatus(selectedTicket.id, 'resolved')} className="btn btn-primary" style={{ flex: 1, background: '#10b981', borderColor: '#10b981' }}>Mark as Resolved</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
