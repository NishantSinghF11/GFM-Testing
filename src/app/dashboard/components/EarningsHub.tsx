import React from 'react';

interface EarningsHubProps {
  orders: any[];
  profile: any;
}

export default function EarningsHub({ orders, profile }: EarningsHubProps) {
  const lifetime = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
  const inEscrow = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
  const available = lifetime * 0.4; // Mocking available as 40% of lifetime for visual variety

  return (
    <div className="animate-fade-in" style={{ padding: '0px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Left: Financial Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Main Wallet Card */}
          <div className="glass-card" style={{ 
            padding: '40px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(167, 139, 250, 0.05))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Quantum Wallet Balance</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>
                  ${available.toLocaleString()}
                  <span style={{ fontSize: '1.5rem', color: '#4B5563', marginLeft: '10px' }}>USD</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '15px 35px', borderRadius: '12px', fontSize: '1rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)' }}>
                Withdraw Funds
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {[
                { label: 'In Escrow', value: inEscrow, color: '#f59e0b', icon: 'fa-lock' },
                { label: 'Lifetime Revenue', value: lifetime, color: '#10b981', icon: 'fa-chart-line' },
                { label: 'Pending Clear', value: 1240, color: '#818cf8', icon: 'fa-clock' }
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }}></i> {stat.label}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>${stat.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Analytics (Mock Chart) */}
          <div className="glass-card" style={{ padding: '30px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Revenue Velocity</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['1W', '1M', '3M', '1Y', 'ALL'].map(t => (
                  <button key={t} style={{ background: t === '3M' ? 'rgba(99,102,241,0.2)' : 'none', border: 'none', padding: '4px 10px', borderRadius: '4px', color: t === '3M' ? 'white' : '#6B7280', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
            
            {/* Mock Chart Visualization */}
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
              {[35, 45, 30, 60, 85, 40, 55, 75, 90, 65, 80, 95].map((h, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  height: `${h}%`, 
                  background: `linear-gradient(180deg, ${i === 11 ? 'var(--color-primary)' : 'rgba(99,102,241,0.2)'}, transparent)`, 
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }}>
                  {i === 11 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 900, color: 'var(--color-primary-light)' }}>ACTIVE</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563', fontSize: '0.7rem' }}>
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
            </div>
          </div>

        </div>

        {/* Right: Intelligence & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Tax & Compliance (Req 15) */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.03)' }}>
            <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 900, letterSpacing: '1px', marginBottom: '15px' }}>COMPLIANCE PULSE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <i className="fa-solid fa-file-shield" style={{ color: '#22c55e', fontSize: '1.5rem' }}></i>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>Tax Readiness: 94%</div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Q2 estimates are auto-staged.</div>
              </div>
            </div>
            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Download Tax Package
            </button>
          </div>

          {/* AI Optimizer (Financial) */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px', marginBottom: '15px' }}>NEURAL REVENUE CO-PILOT</div>
            <p style={{ fontSize: '0.8rem', color: '#D1D5DB', lineHeight: 1.5 }}>
              "Your current average project value is up 18%. We recommend shifting your focus to <strong>Subscription Tenders</strong> to stabilize monthly recurring revenue."
            </p>
            <div style={{ marginTop: '15px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Smart Pricing Recommendation</div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Raise 'Standard' Tier by $45 (Market Drift: +12%)</div>
            </div>
          </div>

          {/* Recent Ledger */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', flex: 1 }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>Transaction Ledger</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.slice(0, 5).map((o, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1E2532' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>{o.gig?.title || 'Project Payment'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>+${o.total_price}</div>
                    <div style={{ fontSize: '0.6rem', color: '#4B5563', textTransform: 'uppercase' }}>Cleared</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
