import React from 'react';
import Link from 'next/link';

interface TendersHubProps {
  orders: any[];
}

export default function TendersHub({ orders }: TendersHubProps) {
  const activeProjects = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastProjects = orders.filter(o => o.status === 'completed');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: 'white' }}>Managed Projects Hub</h2>
          <p style={{ color: '#9CA3AF', margin: 0 }}>Oversee your open tenders, managed hires, and historical deliveries.</p>
        </div>
        <Link href="/post-tender" className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '12px', fontWeight: 700 }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '10px' }}></i> Launch New Tender
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
        
        {/* Left: Active Project Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>Active Pipeline ({activeProjects.length})</h3>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Sorted by Urgency</div>
          </div>

          {activeProjects.length === 0 ? (
            <div style={{ padding: '60px', background: '#0A0D14', border: '1px dashed #1E2532', borderRadius: '24px', textAlign: 'center' }}>
              <i className="fa-solid fa-briefcase fa-3x" style={{ color: '#1E2532', marginBottom: '15px' }}></i>
              <h4 style={{ color: 'white' }}>No Active Hires</h4>
              <p style={{ color: '#6B7280', marginBottom: '20px' }}>You don't have any active project contracts running right now.</p>
              <Link href="/explore" className="btn btn-outline">Explore Marketplace</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeProjects.map(order => (
                <div key={order.id} className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: order.creator?.cover_color || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                      {order.creator?.initials || '??'}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'white' }}>{order.gig?.title || 'Custom Project'}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                        <span>Creator: <strong>{order.creator?.name}</strong></span>
                        <span style={{ color: '#1E2532' }}>|</span>
                        <span>Budget: <strong>${order.total_price}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Current Status</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700, fontSize: '0.85rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
                        {order.status.toUpperCase().replace('_', ' ')}
                      </div>
                    </div>
                    <Link href={`/workspace/${order.id}`} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Open Workspace</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Historical Vault Section */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '20px' }}>Project History ({pastProjects.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {pastProjects.slice(0, 4).map(order => (
                <div key={order.id} style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '12px', padding: '16px' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{order.gig?.title || 'Project'}</div>
                   <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '12px' }}>Finalized: {new Date(order.created_at).toLocaleDateString()}</div>
                   <Link href={`/workspace/${order.id}`} style={{ fontSize: '0.75rem', color: '#818cf8', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                     Access Command Center <i className="fa-solid fa-arrow-right"></i>
                   </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Managed Hires Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px', marginBottom: '15px' }}>HIRE INTELLIGENCE</div>
            <div style={{ background: 'rgba(99,102,241,0.05)', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, marginBottom: '5px' }}>Top Performing Creator</div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '12px' }}>Based on your recent 12 projects.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>JD</div>
                <div style={{ fontSize: '0.85rem', color: 'white' }}>Jordan Digital <span style={{ color: '#22c55e' }}>(98% Score)</span></div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5 }}>Our AI recommends re-engaging with this creator for your upcoming video campaign based on historical efficiency.</p>
          </div>

          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(245,158,11,0.05), transparent)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 900, letterSpacing: '1px', marginBottom: '15px' }}>TENDER ALERTS</div>
            <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600, marginBottom: '8px' }}>Active Bids: 14</div>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '15px' }}>Your "Social Media Redesign" tender has received 4 new high-fidelity bids in the last 2 hours.</p>
            <button className="btn btn-primary" style={{ width: '100%', background: '#f59e0b', border: 'none' }}>Review Bids</button>
          </div>

        </div>

      </div>
    </div>
  );
}
