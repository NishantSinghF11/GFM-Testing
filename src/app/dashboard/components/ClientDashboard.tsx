import React, { useState } from 'react';
import Link from 'next/link';

interface ClientDashboardProps {
  orders: any[];
  user: any;
  profile: any;
}

export default function ClientDashboard({ orders, user, profile }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'hiring' | 'approvals'>('overview');

  const pendingApprovals = orders.filter(o => o.status === 'delivered');
  const activeProjects = orders.filter(o => o.status === 'in_progress' || o.status === 'pending');
  const delayedProjects = orders.filter(o => o.status === 'revision'); // Mocking delayed
  
  const totalSpent = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price), 0);
  const escrowLocked = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar Navigation (Internal to Client) */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #1E2532', marginBottom: '30px' }}>
        {[
          { id: 'overview', label: 'Command Center', icon: 'fa-table-columns' },
          { id: 'projects', label: 'Project Health', icon: 'fa-heart-pulse' },
          { id: 'tenders', label: 'Tender Manager', icon: 'fa-bullhorn' },
          { id: 'approvals', label: 'Review Center', icon: 'fa-clipboard-check', count: pendingApprovals.length },
          { id: 'hiring', label: 'Smart Hiring', icon: 'fa-magnifying-glass' }
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

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* AI Project Manager */}
          <div style={{ background: 'linear-gradient(145deg, rgba(99,102,241,0.05), rgba(17,24,39,1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-robot" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>AI Project Manager</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {pendingApprovals.length > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px' }}><i className="fa-solid fa-circle-exclamation"></i> ACTION REQUIRED</div>
                  <div style={{ fontSize: '0.95rem', color: '#E5E7EB', marginBottom: '12px' }}>You have <strong>{pendingApprovals.length}</strong> deliverables waiting for your approval.</div>
                  <button onClick={() => setActiveTab('approvals')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Go to Review Center</button>
                </div>
              )}
              {delayedProjects.length > 0 && (
                <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px' }}><i className="fa-solid fa-triangle-exclamation"></i> RISK DETECTED</div>
                  <div style={{ fontSize: '0.95rem', color: '#E5E7EB', marginBottom: '12px' }}><strong>{delayedProjects.length}</strong> project(s) are in the revision stage and may miss initial deadlines.</div>
                  <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'rgba(245,158,11,0.5)', color: '#f59e0b' }}>Message Creators</button>
                </div>
              )}
              {activeProjects.length === 0 && pendingApprovals.length === 0 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px' }}><i className="fa-solid fa-lightbulb"></i> SUGGESTION</div>
                  <div style={{ fontSize: '0.95rem', color: '#E5E7EB', marginBottom: '12px' }}>Your project pipeline is empty. Ready to start something new?</div>
                  <button onClick={() => setActiveTab('hiring')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Find a Creator</button>
                </div>
              )}
            </div>
          </div>

          {/* Overview Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { label: 'Active Projects', value: activeProjects.length, icon: 'fa-briefcase', color: '#818cf8' },
              { label: 'Open Tenders', value: 2, icon: 'fa-bullhorn', color: '#f59e0b' },
              { label: 'Pending Approvals', value: pendingApprovals.length, icon: 'fa-clipboard-check', color: '#34d399' },
              { label: 'Total Spent', value: `$${totalSpent}`, icon: 'fa-wallet', color: '#9CA3AF' }
            ].map(stat => (
              <div key={stat.label} style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '12px', padding: '20px' }}>
                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: '1.2rem', marginBottom: '12px', display: 'block' }}></i>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      )}

      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Project Health System</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Real-time status of all your ongoing contracts.</p>

          {activeProjects.concat(delayedProjects).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
              <i className="fa-solid fa-folder-open fa-3x" style={{ color: '#374151', marginBottom: '15px' }}></i>
              <h3 style={{ color: 'white' }}>No Active Projects</h3>
              <button onClick={() => setActiveTab('hiring')} className="btn btn-primary" style={{ marginTop: '10px' }}>Start a Project</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeProjects.concat(delayedProjects).map(order => {
                const isDelayed = order.status === 'revision';
                return (
                  <div key={order.id} style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{order.gig?.title || 'Custom Order'}</h4>
                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, 
                          background: isDelayed ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                          color: isDelayed ? '#f59e0b' : '#22c55e', border: `1px solid ${isDelayed ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}`
                        }}>
                          {isDelayed ? 'AT RISK' : 'ON TRACK'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: order.creator?.cover_color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.5rem', fontWeight: 'bold' }}>{order.creator?.initials}</div>
                          {order.creator?.name}
                        </span>
                        <span><i className="fa-solid fa-lock" style={{ marginRight: '4px' }}></i> ${order.total_price} Escrow</span>
                        <span><i className="fa-solid fa-bolt" style={{ marginRight: '4px', color: '#eab308' }}></i> Response: Fast</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link href={`/workspace/${order.id}`} className="btn btn-outline">Workspace</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tenders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Tender Management</h2>
            <Link href="/post-tender" className="btn btn-primary animate-shimmer">Launch New Tender</Link>
          </div>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Manage your open project competitions and review incoming bids.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
            <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b' }}>🔥 14 NEW BIDS</span>
                <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>OPEN</span>
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>Cinematic Brand Documentary</h4>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '20px' }}>The AI has ranked 3 creators as "Best Fit" for this project. Review them now to move to the shortlist.</p>
              <Link href="/tenders/t1" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Manage Tender</Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>Review & Approval Center</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>Deliverables awaiting your feedback or final approval.</p>

          {pendingApprovals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
              <i className="fa-solid fa-check-double fa-3x" style={{ color: '#374151', marginBottom: '15px' }}></i>
              <h3 style={{ color: 'white' }}>You're all caught up!</h3>
              <p style={{ color: '#9CA3AF' }}>No pending deliverables to review right now.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {pendingApprovals.map(order => (
                <div key={order.id} style={{ background: '#111827', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '16px', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, letterSpacing: '0.5px' }}>WAITING APPROVAL</span>
                      <span style={{ fontSize: '0.8rem', color: '#D1D5DB', fontWeight: 600 }}>${order.total_price}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'white' }}>{order.gig?.title || 'Custom Project'}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '20px' }}>The creator has submitted the final files for this project. Please review them in the workspace.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link href={`/workspace/${order.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Review Files</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'hiring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'white', fontSize: '1.5rem' }}></i>
            </div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', color: 'white' }}>Smart Hiring Assistant</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '30px' }}>Let our AI match you with the perfect creator for your next project based on your requirements and past hires.</p>
            
            <div style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '30px', padding: '8px 8px 8px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8', fontSize: '1.2rem', marginRight: '15px' }}></i>
              <input 
                type="text" 
                placeholder="Describe what you need built..." 
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
              />
              <button className="btn btn-primary" style={{ borderRadius: '24px', padding: '12px 24px' }}>Match Me</button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
              {['Video Editing', 'UI/UX Design', 'Web Development', 'Motion Graphics'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#D1D5DB', cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
