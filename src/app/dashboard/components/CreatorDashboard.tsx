import React, { useState } from 'react';
import Link from 'next/link';
import DashboardKanban from './DashboardKanban';
import DashboardFinancials from './DashboardFinancials';
import CreatorAnalytics from '@/components/dashboard/CreatorAnalytics';
import MarketPulse from '@/components/dashboard/MarketPulse';

interface CreatorDashboardProps {
  orders: any[];
  user: any;
  profile: any;
  gigs: any[];
}

export default function CreatorDashboard({ orders, user, profile, gigs }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'workload' | 'earnings' | 'gigs' | 'inbox'>('workload');

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'in_progress');
  const revisionOrders = orders.filter(o => o.status === 'revision');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar Navigation (Internal to Creator) */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #1E2532', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { id: 'workload', label: 'Work Pipeline', icon: 'fa-layer-group' },
          { id: 'opportunities', label: 'Market Opportunities', icon: 'fa-bullhorn' },
          { id: 'earnings', label: 'Business Intelligence', icon: 'fa-chart-pie' },
          { id: 'gigs', label: 'AI Gig Optimizer', icon: 'fa-wand-magic-sparkles' },
          { id: 'inbox', label: 'Deal Pipeline', icon: 'fa-comments', count: pendingOrders.length }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              background: 'none', border: 'none', padding: '0 0 15px 0', cursor: 'pointer',
              color: activeTab === tab.id ? 'white' : '#6B7280',
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
              fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
            }}
          >
            <i className={`fa-solid ${tab.icon}`} style={{ color: activeTab === tab.id ? 'var(--color-primary-light)' : '#4B5563' }}></i>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{ background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.65rem' }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'workload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Workload AI Copilot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '10px' }}>
            <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <i className="fa-solid fa-bolt" style={{ color: '#818cf8', fontSize: '1.5rem', marginTop: '4px' }}></i>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>Quick Delivery Toolkit</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF' }}>You have {inProgressOrders.length} projects in progress. Ready to submit a draft?</p>
              </div>
            </div>
            
            {revisionOrders.length > 0 && (
              <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <i className="fa-solid fa-rotate" style={{ color: '#f59e0b', fontSize: '1.5rem', marginTop: '4px' }}></i>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>Priority Revisions</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF' }}>{revisionOrders.length} project(s) need revisions. Handle these first to unlock escrow.</p>
                </div>
              </div>
            )}
            
            {revisionOrders.length === 0 && (
              <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#22c55e', fontSize: '1.5rem', marginTop: '4px' }}></i>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>Level 3 Creator</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF' }}>Your response rate is 98%. Maintain this to unlock Top Rated status.</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Production Pipeline</h2>
            <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', borderColor: '#374151' }}><i className="fa-solid fa-filter"></i> Filter</button>
          </div>
          
          <DashboardKanban orders={orders} user={user} />
        </div>
      )}

      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Business Intelligence</h2>
          <DashboardFinancials orders={orders} profile={profile} />
          <div style={{ marginTop: '20px', borderTop: '1px solid #1E2532', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#818cf8' }}>Advanced Growth Metrics</h3>
            <CreatorAnalytics orders={orders} />
            <MarketPulse />
          </div>
        </div>
      )}

      {activeTab === 'gigs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>AI Gig Optimizer</h2>
            <Link href="/post-gig" className="btn btn-primary">+ Create New Gig</Link>
          </div>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Let our AI analyze your gig performance and suggest SEO improvements.</p>

          {gigs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
              <i className="fa-solid fa-wand-magic-sparkles fa-3x" style={{ color: '#818cf8', marginBottom: '15px' }}></i>
              <h3 style={{ color: 'white' }}>Optimize Your First Gig</h3>
              <p style={{ color: '#9CA3AF' }}>Create a gig to get AI pricing and SEO recommendations.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
              {gigs.map(gig => (
                <div key={gig.id} style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', display: 'flex', gap: '16px', borderBottom: '1px solid #1E2532' }}>
                    <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#1E2532' }}>
                      <img src={gig.cover_image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop'} alt={gig.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: 'white' }}>{gig.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Current Price: <strong>${gig.price}</strong></div>
                    </div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(99,102,241,0.03)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px' }}><i className="fa-solid fa-robot"></i> AI RECOMMENDATIONS</div>
                    
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#D1D5DB', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      <li style={{ marginBottom: '6px' }}><strong>Pricing:</strong> Based on market demand, you could raise your price to ${Math.floor(gig.price * 1.2)} without losing volume.</li>
                      <li><strong>SEO:</strong> Add keywords like "Cinematic" and "4K" to your description to boost search ranking.</li>
                    </ul>
                    
                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}>Apply AI Suggestions</button>
                      <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Edit Manually</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Market Opportunities</h2>
            <Link href="/tenders" className="btn btn-primary">Open Tender Board</Link>
          </div>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>High-stakes project tenders looking for your specific talent.</p>
          
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.2)' }}>
            <i className="fa-solid fa-fire fa-3x" style={{ color: '#f59e0b', marginBottom: '15px' }}></i>
            <h3 style={{ color: 'white' }}>14 New "Hot" Tenders</h3>
            <p style={{ color: '#9CA3AF', maxWidth: '500px', margin: '0 auto 20px' }}>Our AI has matched you with 14 open project competitions where your win probability is over 85%.</p>
            <Link href="/tenders" className="btn btn-primary animate-shimmer">View Matched Tenders</Link>
          </div>
        </div>
      )}

      {activeTab === 'inbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Smart Lead Inbox</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>New project requests categorized by urgency and value.</p>

          {pendingOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
              <i className="fa-solid fa-inbox fa-3x" style={{ color: '#374151', marginBottom: '15px' }}></i>
              <h3 style={{ color: 'white' }}>Inbox Zero</h3>
              <p style={{ color: '#9CA3AF' }}>You have no pending project requests right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingOrders.map(order => {
                const isHighValue = Number(order.total_price) > 500;
                return (
                  <div key={order.id} style={{ background: '#111827', border: `1px solid ${isHighValue ? 'rgba(139,92,246,0.5)' : '#1E2532'}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{order.gig?.title || 'Custom Project Request'}</h4>
                        {isHighValue && (
                          <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
                            HIGH VALUE LEAD
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: order.client?.cover_color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.5rem', fontWeight: 'bold' }}>{order.client?.initials}</div>
                          {order.client?.name}
                        </span>
                        <span style={{ color: 'white', fontWeight: 600 }}>${order.total_price} Budget</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Decline</button>
                      <button className="btn btn-primary" onClick={() => window.location.href = `/workspace/${order.id}`}>Review Scope</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
