import React from 'react';

interface FinancialsProps {
  orders: any[];
  profile: any;
}

export default function DashboardFinancials({ orders, profile }: FinancialsProps) {
  // Calculate financials
  let escrow = 0;
  let available = 0;
  let lifetime = 0;

  orders.forEach(o => {
    const price = Number(o.total_price) || 0;
    if (o.status === 'completed') {
      lifetime += price;
      // In a real app, available would be (completed - withdrawn).
      // Here we assume recent completed are available.
      available += price; 
    } else if (o.status !== 'cancelled') {
      escrow += price;
    }
  });

  // Simple mock AI revenue forecast (Escrow + Available + +15% growth projection)
  const projectedMonthly = (available + escrow) * 1.15;

  return (
    <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-wallet" style={{ color: 'var(--color-primary-light)' }}></i> Financial Hub
        </h3>
        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Withdraw</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        
        {/* Available */}
        <div style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-money-bill-wave" style={{ color: '#22c55e' }}></i> Available
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>${available.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>Ready for withdrawal</div>
        </div>

        {/* Escrow */}
        <div style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-lock" style={{ color: '#f59e0b' }}></i> In Escrow
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>${escrow.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>Locked in active projects</div>
        </div>

        {/* Lifetime */}
        <div style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-chart-line" style={{ color: '#818cf8' }}></i> Lifetime
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>${lifetime.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>Total historical earnings</div>
        </div>
      </div>

      {/* AI Forecast */}
      <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-robot" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>AI Revenue Forecast</div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Projected earnings for this month based on current pipeline</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>~${projectedMonthly.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.7rem', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <i className="fa-solid fa-arrow-trend-up"></i> +15% growth
          </div>
        </div>
      </div>

    </div>
  );
}
