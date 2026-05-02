import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface GigsHubProps {
  gigs: any[];
  setGigs: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function GigsHub({ gigs, setGigs }: GigsHubProps) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("CRITICAL: This will permanently purge this production and all associated media. Proceed?")) {
      setDeletingId(id);
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Purge Attempt by User:", user?.id);

      // Attempt purge
      const { error, count } = await supabase
        .from('gigs')
        .delete({ count: 'exact' })
        .eq('id', id);
      
      if (error) {
        alert("PURGE REJECTED: " + error.message);
        setDeletingId(null);
      } else if (count === 0) {
        alert("SECURITY LOCK: Record not found or permission denied. Gig might already be deleted or RLS is blocking you.");
        // Even if DB fails to find it, remove from UI if the user wants it gone
        setGigs(prev => prev.filter(g => g.id !== id));
        setDeletingId(null);
      } else {
        // SUCCESS: Instant UI Update (Zero Refresh)
        console.log("Purge Successful. Updating UI...");
        setGigs(prev => prev.filter(g => g.id !== id));
        setDeletingId(null);
        setActiveMenu(null);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', color: 'white' }}>Production Inventory</h2>
          <p style={{ color: '#9CA3AF', margin: 0 }}>Manage, optimize, and scale your creative services.</p>
        </div>
        <Link href="/post-gig" className="btn btn-primary" style={{ padding: '12px 30px', borderRadius: '12px', fontWeight: 700 }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '10px' }}></i> Deploy New Gig
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .action-menu {
          animation: slideDownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}} />

      {gigs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', background: '#0A0D14', border: '1px dashed #1E2532', borderRadius: '24px' }}>
          <i className="fa-solid fa-clapperboard fa-4x" style={{ color: '#1E2532', marginBottom: '20px' }}></i>
          <h3 style={{ color: 'white' }}>No Active Gigs Found</h3>
          <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto 25px' }}>Start your journey by deploying your first creative service to the GFM Global Marketplace.</p>
          <Link href="/post-gig" className="btn btn-primary">Deploy First Gig</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '24px' }}>
          {gigs.map(gig => (
            <div key={gig.id} className="glass-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', opacity: deletingId === gig.id ? 0.3 : 1, transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, rgba(17,24,39,0.8), rgba(10,13,20,0.9))' }}>
              
              {/* Quick Actions Dot Menu */}
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 100 }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === gig.id ? null : gig.id);
                  }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>

                {activeMenu === gig.id && (
                  <div className="action-menu" style={{ position: 'absolute', top: '45px', right: 0, width: '220px', background: 'rgba(10,13,20,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 101 }}>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280', padding: '5px 12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Management</div>
                    <Link href={`/edit-gig/${gig.id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'white', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '10px', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <i className="fa-solid fa-sliders" style={{ color: '#818cf8', width: '16px' }}></i> Production Studio
                    </Link>
                    <button style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'white', background: 'none', border: 'none', fontSize: '0.85rem', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <i className="fa-solid fa-chart-line" style={{ color: '#10b981', width: '16px' }}></i> Market Intelligence
                    </button>
                    <button style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: 'white', background: 'none', border: 'none', fontSize: '0.85rem', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <i className="fa-solid fa-pause" style={{ color: '#f59e0b', width: '16px' }}></i> Pause Service
                    </button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 12px' }}></div>
                    <button 
                      onClick={() => handleDelete(gig.id)}
                      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#ef4444', background: 'none', border: 'none', fontSize: '0.85rem', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className="fa-solid fa-trash-can" style={{ width: '16px' }}></i> Decommission
                    </button>
                  </div>
                )}
              </div>

              {/* Main Info Section */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '140px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, background: '#1E2532', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  <img src={gig.cover_image || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=300&h=200&fit=crop'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6), transparent)' }}></div>
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', fontWeight: 800 }}>LIVE</div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingRight: '50px', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'white', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{gig.title}</h3>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Active Production</span>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#374151' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{gig.category?.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>${gig.price_basic || gig.price || 0}</div>
                      <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>BASE RATE</div>
                    </div>
                  </div>

                  {/* High-Density Performance Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 800, letterSpacing: '0.5px' }}>VIEWS</span>
                      <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>1.2k <span style={{ color: '#10b981', fontSize: '0.6rem' }}><i className="fa-solid fa-arrow-up"></i> 12%</span></span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 800, letterSpacing: '0.5px' }}>CONV. RATE</span>
                      <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>4.8%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 800, letterSpacing: '0.5px' }}>PIPELINE</span>
                      <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 700 }}>8 Active</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 800, letterSpacing: '0.5px' }}>REVENUE</span>
                      <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 800 }}>$4.2k</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Toolkit command bar */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                  {/* Neural Boost Glow */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #818cf8, transparent)', animation: 'slideRight 3s linear infinite' }}></div>
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes slideRight {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                    @keyframes pulseNeon {
                      0% { box-shadow: 0 0 5px rgba(139,92,246,0.2); }
                      50% { box-shadow: 0 0 20px rgba(139,92,246,0.5); }
                      100% { box-shadow: 0 0 5px rgba(139,92,246,0.2); }
                    }
                  `}} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px' }}>NEURAL BOOSTER</div>
                    <span style={{ fontSize: '0.6rem', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>3.2x REACH</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#D1D5DB', margin: '0 0 12px 0', lineHeight: 1.5 }}>Booster active: Your production is currently being prioritized in search results for high-intent clients.</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.75rem', borderRadius: '10px', animation: 'pulseNeon 2s infinite' }}>
                      <i className="fa-solid fa-rocket" style={{ marginRight: '6px' }}></i> Increase Boost
                    </button>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Analyze Stats
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 800 }}>QUICK UTILITIES</span>
                    <i className="fa-solid fa-bolt-lightning" style={{ color: '#f59e0b', fontSize: '0.8rem' }}></i>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => { navigator.clipboard.writeText(`https://gfm.com/gig/${gig.id}`); alert("Production link copied to clipboard!"); }}>
                      <i className="fa-solid fa-link"></i> Share
                    </button>
                    <Link href={`/gig/${gig.id}`} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      <i className="fa-solid fa-eye"></i> Preview
                    </Link>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-copy"></i> Clone
                    </button>
                    <Link href={`/edit-gig/${gig.id}`} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textDecoration: 'none' }}>
                      <i className="fa-solid fa-pen-nib"></i> Edit
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
