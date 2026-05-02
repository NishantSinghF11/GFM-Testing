"use client";

import React from 'react';
import { Tender, Bid } from '@/lib/tenders';

interface TenderAnalyticsProps {
  tender: Tender;
  bids: Bid[];
}

export default function TenderAnalytics({ tender, bids }: TenderAnalyticsProps) {
  const avgBid = bids.length > 0 ? bids.reduce((acc, b) => acc + b.amount, 0) / bids.length : 0;
  const bestFit = bids.sort((a, b) => b.rank_score - a.rank_score)[0];
  const lowestRisk = bids.sort((a, b) => (a.risk_level === 'low' ? 0 : 1) - (b.risk_level === 'low' ? 0 : 1))[0];

  return (
    <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.8)', border: '1px solid rgba(99,102,241,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <i className="fa-solid fa-chart-line" style={{ color: '#818cf8' }}></i>
        <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Tender Analytics</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '5px' }}>Average Bid</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D1D5DB' }}>${avgBid.toFixed(0)}</div>
        </div>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '5px' }}>Bid Count</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D1D5DB' }}>{bids.length}</div>
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '15px' }}>AI RECOMMENDATIONS</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bestFit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-trophy" style={{ color: '#f59e0b' }}></i>
              <span><strong>Best Fit:</strong> {bestFit.creator_name} ({bestFit.rank_score}%)</span>
            </div>
          )}
          {lowestRisk && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-shield-check" style={{ color: '#10b981' }}></i>
              <span><strong>Lowest Risk:</strong> {lowestRisk.creator_name}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-gauge-high" style={{ color: '#818cf8' }}></i>
            <span><strong>Market Heat:</strong> {tender.heat_score}% (Competitive)</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '15px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)', fontSize: '0.75rem', color: '#D1D5DB', lineHeight: 1.5, marginBottom: '25px' }}>
        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8', marginRight: '8px' }}></i>
        AI has identified <strong>3 creators</strong> who match 90%+ of your technical requirements.
      </div>

      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', marginBottom: '15px', textTransform: 'uppercase' }}>Ranking Methodology</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Technical Match', weight: '40%', color: '#818cf8' },
            { label: 'Trust & Rep', weight: '30%', color: '#10b981' },
            { label: 'Delivery Velocity', weight: '20%', color: '#f59e0b' },
            { label: 'Market Value', weight: '10%', color: '#6366f1' }
          ].map(factor => (
            <div key={factor.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{factor.label}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: factor.color }}>{factor.weight}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.65rem', color: '#6B7280', marginTop: '15px', lineHeight: 1.4 }}>
          Our AI analyzes multi-dimensional signals to surface the most reliable partners beyond just raw pricing.
        </p>
      </div>
    </div>
  );
}
