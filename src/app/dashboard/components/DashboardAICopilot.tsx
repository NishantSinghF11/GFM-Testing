import React from 'react';
import Link from 'next/link';

interface AICopilotProps {
  orders: any[];
  user: any;
  profile: any;
}

export default function DashboardAICopilot({ orders, user, profile }: AICopilotProps) {
  const isCreator = profile?.role === 'creator';
  
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'in_progress');
  const reviewOrders = orders.filter(o => o.status === 'delivered');
  const revisionOrders = orders.filter(o => o.status === 'revision');
  
  // Generate AI Insights based on data
  let insights = [];
  
  if (isCreator) {
    if (reviewOrders.length > 0) {
      insights.push({ type: 'success', text: `You have ${reviewOrders.length} project(s) pending client approval. Escrow release is near!` });
    }
    if (revisionOrders.length > 0) {
      insights.push({ type: 'warning', text: `Action Required: ${revisionOrders.length} project(s) need revisions.` });
    }
    if (pendingOrders.length > 0) {
      insights.push({ type: 'info', text: `You have ${pendingOrders.length} new briefing(s) to review.` });
    }
    if (inProgressOrders.length > 3) {
      insights.push({ type: 'alert', text: `High Workload Detected: You have ${inProgressOrders.length} active projects. Consider pausing new gig requests to maintain quality.` });
    } else if (inProgressOrders.length === 0) {
      insights.push({ type: 'info', text: `Your pipeline is empty. Consider promoting your gigs to attract new clients.` });
    }
  } else {
    // Client insights
    if (reviewOrders.length > 0) {
      insights.push({ type: 'warning', text: `Action Required: You have ${reviewOrders.length} delivery(s) waiting for your review.` });
    }
    if (pendingOrders.length > 0) {
      insights.push({ type: 'info', text: `Waiting for creator to start on ${pendingOrders.length} project(s).` });
    }
  }

  // Fallback if no specific insights
  if (insights.length === 0) {
    insights.push({ type: 'success', text: `Everything is looking good! You are fully caught up.` });
  }

  return (
    <div style={{ background: 'linear-gradient(145deg, #0A0D14, #111827)', border: '1px solid #1E2532', borderRadius: '12px', padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative AI background element */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--color-primary-light)', fontSize: '1.2rem' }}></i>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>AI Copilot Insights</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {insights.map((insight, idx) => {
          let bg = 'rgba(255,255,255,0.03)';
          let border = '#1E2532';
          let icon = 'fa-circle-info';
          let color = '#9CA3AF';
          
          if (insight.type === 'warning') {
            bg = 'rgba(245,158,11,0.05)'; border = 'rgba(245,158,11,0.2)'; icon = 'fa-triangle-exclamation'; color = '#f59e0b';
          } else if (insight.type === 'success') {
            bg = 'rgba(34,197,94,0.05)'; border = 'rgba(34,197,94,0.2)'; icon = 'fa-check-circle'; color = '#22c55e';
          } else if (insight.type === 'alert') {
            bg = 'rgba(239,68,68,0.05)'; border = 'rgba(239,68,68,0.2)'; icon = 'fa-bell'; color = '#ef4444';
          } else if (insight.type === 'info') {
            icon = 'fa-lightbulb'; color = 'var(--color-primary-light)';
          }
          
          return (
            <div key={idx} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <i className={`fa-solid ${icon}`} style={{ color: color, fontSize: '1.1rem', marginTop: '2px' }}></i>
              <div style={{ fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.5 }}>{insight.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
