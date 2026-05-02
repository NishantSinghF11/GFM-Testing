import React from 'react';
import Link from 'next/link';

interface KanbanProps {
  orders: any[];
  user: any;
}

export default function DashboardKanban({ orders, user }: KanbanProps) {
  
  const columns = [
    { id: 'pending', label: 'Briefing & Queue', icon: 'fa-clipboard-list', color: '#6B7280' },
    { id: 'in_progress', label: 'In Progress', icon: 'fa-hammer', color: 'var(--color-primary-light)' },
    { id: 'revision', label: 'Revisions', icon: 'fa-rotate', color: '#f59e0b' },
    { id: 'delivered', label: 'In Review', icon: 'fa-eye', color: '#818cf8' },
  ];

  // We exclude completed from the main Kanban view to keep it focused on active work,
  // but we can add a 'completed' column if needed. Let's just do active ones.
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
      {columns.map(col => {
        const colOrders = activeOrders.filter(o => o.status === col.id);
        
        return (
          <div key={col.id} style={{ background: '#0F131D', border: '1px solid #1E2532', borderRadius: '10px', display: 'flex', flexDirection: 'column', height: '600px' }}>
            
            {/* Column Header */}
            <div style={{ padding: '16px', borderBottom: `2px solid ${col.color}`, background: 'rgba(0,0,0,0.2)', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                  <i className={`fa-solid ${col.icon}`} style={{ color: col.color }}></i> {col.label}
                </div>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB' }}>
                  {colOrders.length}
                </span>
              </div>
            </div>

            {/* Column Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {colOrders.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#4B5563', fontSize: '0.8rem', padding: '20px 0', borderStyle: 'dashed', borderWidth: '1px', borderColor: '#1E2532', borderRadius: '6px' }}>
                  Empty
                </div>
              ) : (
                colOrders.map(order => {
                  const isClient = order.client_id === user?.id;
                  const otherParty = isClient ? order.creator : order.client;
                  
                  return (
                    <div key={order.id} style={{ background: '#1A1E29', border: '1px solid #2D3748', borderRadius: '8px', padding: '14px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 12px rgba(0,0,0,0.3), 0 0 0 1px ${col.color}`; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#2D3748'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order #{order.id}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>${Number(order.total_price).toFixed(0)}</span>
                      </div>
                      
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'white', lineHeight: 1.4 }}>{order.gig?.title || 'Custom Project'}</h4>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: otherParty?.cover_color || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>
                            {otherParty?.initials || '??'}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>{otherParty?.name || 'User'}</span>
                        </div>
                        
                        <Link href={`/workspace/${order.id}`} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--color-primary-light)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', textDecoration: 'none', fontWeight: 600 }}>
                          Workspace <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
