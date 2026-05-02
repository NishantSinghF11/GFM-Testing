"use client";

import React, { useMemo } from 'react';
import { Conversation } from './types';

interface CreatorAnalyticsProps {
  conversations?: Conversation[];
  orders?: any[];
}

export default function CreatorAnalytics({ conversations = [], orders = [] }: CreatorAnalyticsProps) {
  
  const stats = useMemo(() => {
    // If we have orders, use them to calculate real metrics
    const baseCount = conversations.length || orders.length || 0;
    const totalPipelineValue = (conversations.length * 1250) || orders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0) || 0;
    const highIntentDeals = conversations.filter(c => c.heat === 'hot').length || orders.filter(o => o.status === 'in_progress').length || 0;
    const avgConfidence = 78; // Mock average
    const potentialRevenue = (totalPipelineValue * (avgConfidence / 100)).toFixed(2);
    
    return {
      totalPipelineValue,
      highIntentDeals,
      avgConfidence,
      potentialRevenue,
      velocity: '4.2 days', // Mock: average time to close
      activeLeads: baseCount
    };
  }, [conversations, orders]);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {/* Forecast Card */}
        <div style={{ background: 'linear-gradient(135deg, #1E2532 0%, #0A0D14 100%)', border: '1px solid #6366f1', borderRadius: '20px', padding: '25px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '2rem' }}>
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>Forecasted Revenue</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>${stats.potentialRevenue}</div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> +12% from last week
          </div>
        </div>

        {/* Velocity Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '20px', padding: '25px' }}>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>Deal Velocity</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.velocity}</div>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '10px' }}>Average time from inquiry to funded</div>
        </div>
      </div>

      {/* Pipeline Breakdown */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '20px', padding: '25px' }}>
        <h4 style={{ margin: '0 0 20px 0', fontSize: '0.95rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
          Pipeline Distribution
          <span style={{ color: '#6366f1', fontSize: '0.75rem' }}>{stats.activeLeads} Active Deals</span>
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { label: 'Hot Leads', count: stats.highIntentDeals, color: '#ef4444', percent: (stats.highIntentDeals / stats.activeLeads) * 100 },
            { label: 'Negotiating', count: Math.ceil(stats.activeLeads * 0.4), color: '#818cf8', percent: 40 },
            { label: 'Discovery', count: Math.floor(stats.activeLeads * 0.3), color: '#9CA3AF', percent: 30 }
          ].map(row => (
            <div key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: '#D1D5DB' }}>{row.label}</span>
                <span style={{ fontWeight: 700 }}>{row.count}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${row.percent}%`, height: '100%', background: row.color, borderRadius: '3px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strategy Nudge */}
      <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '20px', padding: '20px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ width: '40px', height: '40px', background: 'rgba(168,85,247,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', flexShrink: 0 }}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '5px' }}>Business Strategy Suggestion</div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#D1D5DB', lineHeight: 1.5 }}>
            Your "Deal Velocity" is high, but conversion on "Negotiation" stage is 15% lower than average. Consider offering a <strong>5% "Fast-Track" discount</strong> to close deals within 24 hours.
          </p>
        </div>
      </div>

      {/* Growth Metric */}
      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <i className="fa-solid fa-trophy" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Top 5% Performer</div>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Your responsiveness is faster than 95% of creators.</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Efficiency</div>
          <div style={{ fontWeight: 800, color: '#10b981' }}>9.8/10</div>
        </div>
      </div>
      {/* Strategic AI Tip */}
      <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '5rem', color: 'rgba(245,158,11,0.03)', transform: 'rotate(-15deg)' }}>
          <i className="fa-solid fa-lightbulb"></i>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#f59e0b' }}></i>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic AI Tip</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
          Your <strong>Deal Velocity</strong> is 15% higher than average this month. Consider offering an "Express Handover" premium tier to capitalize on your efficiency.
        </p>
      </div>
    </div>
  );
}
