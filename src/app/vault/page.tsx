"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Milestone {
  id: string;
  title: string;
  amount: number;
  status: 'funded' | 'in-progress' | 'reviewing' | 'released';
  dueDate: string;
}

export default function VaultPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Conceptual Storyboarding', amount: 1200, status: 'released', dueDate: 'Oct 12' },
    { id: '2', title: 'Principal Cinematography', amount: 4500, status: 'reviewing', dueDate: 'Oct 28' },
    { id: '3', title: 'VFX & Color Grading', amount: 2800, status: 'funded', dueDate: 'Nov 15' },
    { id: '4', title: 'Final Mastering & Delivery', amount: 1500, status: 'in-progress', dueDate: 'Nov 30' },
  ]);

  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalBudget = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedFunds = milestones.filter(m => m.status === 'released').reduce((sum, m) => sum + m.amount, 0);
  const lockedFunds = totalBudget - releasedFunds;

  const handleRelease = (id: string) => {
    setIsReleasing(true);
    setTimeout(() => {
      setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'released' } : m));
      setIsReleasing(false);
      setActiveMilestone(null);
      setSuccessMessage("Funds released to Creator's Vault successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 2000);
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'released': return '#10b981';
      case 'reviewing': return '#f59e0b';
      case 'funded': return '#6366f1';
      case 'in-progress': return '#818cf8';
      default: return '#9CA3AF';
    }
  };

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px' }}>
      <div style={{ position: 'absolute', top: '0', right: '0', width: '100%', height: '400px', background: 'radial-gradient(circle at top right, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

      {/* RELEASE CONFIRMATION MODAL */}
      {activeMilestone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', borderRadius: '32px', border: '1px solid rgba(99,102,241,0.3)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 25px' }}>
              <i className="fa-solid fa-signature"></i>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Digital <span className="text-gradient">Signature</span></h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '30px' }}>
              You are about to release <strong>${activeMilestone.amount.toLocaleString()}</strong> for "{activeMilestone.title}". 
              This action is irreversible and transfers funds from Escrow to the Creator.
            </p>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setActiveMilestone(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => handleRelease(activeMilestone.id)} className="btn btn-primary" style={{ flex: 1, position: 'relative', overflow: 'hidden' }} disabled={isReleasing}>
                {isReleasing ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    Signing...
                  </div>
                ) : 'Authorize Release'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS NOTIFICATION */}
      {successMessage && (
        <div style={{ position: 'fixed', top: '100px', right: '40px', zIndex: 1100, padding: '20px 30px', background: '#10b981', color: 'white', borderRadius: '16px', fontWeight: 700, boxShadow: '0 10px 30px rgba(16,185,129,0.3)', animation: 'slideInRight 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)' }}>
          <i className="fa-solid fa-circle-check" style={{ marginRight: '10px' }}></i>
          {successMessage}
        </div>
      )}

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: '20px', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '15px', letterSpacing: '1px' }}>
              <i className="fa-solid fa-vault"></i> GFM VAULT™ SECURED
            </div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>Project <span className="text-gradient">Financials</span></h1>
            <p style={{ color: '#9CA3AF' }}>Manage milestones, escrow releases, and payment integrity for "Cyberpunk 2077 Fan Film."</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-download"></i> Export Invoice
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-plus"></i> Add Milestone
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '40px' }}>
          
          {/* MAIN CONTENT: MILESTONES */}
          <section>
            <div className="glass-card" style={{ borderRadius: '32px', border: '1px solid #1E2532', overflow: 'hidden' }}>
              <div style={{ padding: '30px', borderBottom: '1px solid #1E2532', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Milestones</h3>
                <div style={{ color: '#6B7280', fontSize: '0.85rem' }}>{milestones.length} Total Milestones</div>
              </div>
              
              <div style={{ padding: '0 30px' }}>
                {milestones.map((m, index) => (
                  <div key={m.id} style={{ padding: '30px 0', borderBottom: index === milestones.length - 1 ? 'none' : '1px solid #1E2532', display: 'grid', gridTemplateColumns: '0.5fr 2fr 1fr 1fr 1fr', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: '#4B5563', fontWeight: 800 }}>0{index + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '5px' }}>{m.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Due {m.dueDate}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>${m.amount.toLocaleString()}</div>
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${getStatusColor(m.status)}15`, color: getStatusColor(m.status), padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <div style={{ width: '6px', height: '6px', background: getStatusColor(m.status), borderRadius: '50%' }}></div>
                        {m.status.replace('-', ' ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {m.status === 'reviewing' ? (
                        <button onClick={() => setActiveMilestone(m)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Release Funds</button>
                      ) : m.status === 'released' ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-circle-check"></i> RELEASED
                        </div>
                      ) : (
                        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Details</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRANSACTION HISTORY PREVIEW */}
            <div style={{ marginTop: '40px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#9CA3AF' }}>Recent Vault Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { action: 'Milestone Released', details: 'Conceptual Storyboarding', date: '2 hours ago', amount: '+ $1,200', type: 'positive' },
                  { action: 'Funds Secured', details: 'VFX & Color Grading', date: 'Yesterday', amount: 'Escrow Locked', type: 'neutral' },
                  { action: 'Payment Processing', details: 'Cinematography Deposit', date: '3 days ago', amount: '+ $2,000', type: 'positive' }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '15px 25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', background: item.type === 'positive' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'positive' ? '#10b981' : '#818cf8' }}>
                        <i className={`fa-solid ${item.type === 'positive' ? 'fa-arrow-up-right' : 'fa-lock'}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.action}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.details} • {item.date}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: item.type === 'positive' ? '#10b981' : '#818cf8' }}>{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SIDEBAR: SUMMARY & PROTECTION */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* VAULT SUMMARY CARD */}
            <div style={{ padding: '35px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '32px', boxShadow: '0 20px 40px rgba(99,102,241,0.2)', transition: 'all 0.5s ease' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.8, marginBottom: '5px' }}>Total Project Budget</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '25px' }}>${totalBudget.toLocaleString()}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Funds Released</div>
                  <div style={{ fontWeight: 700 }}>${releasedFunds.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Locked in Escrow</div>
                  <div style={{ fontWeight: 700 }}>${lockedFunds.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ marginTop: '30px', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '16px', fontSize: '0.75rem', lineHeight: 1.5 }}>
                <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>
                GFM Protocol guarantees that <strong>100%</strong> of locked funds are collateralized and ready for immediate release.
              </div>
            </div>

            {/* INSTANT PAYOUT STATUS */}
            <div style={{ padding: '30px', background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Instant Payout</h4>
                <div style={{ padding: '4px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800 }}>ELIGIBLE</div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '20px' }}>
                Based on your **98% Trust Score**, you can withdraw released funds immediately to your bank. No 7-day holding period.
              </p>
              <button className="btn btn-primary" style={{ width: '100%', background: '#10b981', borderColor: '#10b981', fontWeight: 800 }} onClick={() => setSuccessMessage("Withdrawal of $1,200 initiated via Instant Payout.")}>Withdraw $1,200 Now</button>
            </div>

            {/* PROTECTION BADGE */}
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <i className="fa-solid fa-shield-halved fa-3x" style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '15px' }}></i>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>This project is covered by GFM Dispute Protection Insurance up to $10,000.</div>
            </div>

          </aside>

        </div>

      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
