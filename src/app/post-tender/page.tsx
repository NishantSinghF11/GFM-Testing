"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostTenderPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // AI BRIEF FIDELITY LOGIC
  const briefFidelity = useMemo(() => {
    let score = 0;
    if (title.length > 10) score += 20;
    if (desc.length > 50) score += 30;
    if (desc.length > 150) score += 20;
    if (category) score += 15;
    if (budgetMax) score += 15;
    return Math.min(score, 100);
  }, [title, desc, category, budgetMax]);

  const aiSuggestions = useMemo(() => {
    if (category === 'video-editing') {
      return ["Suggest 4K 10-bit delivery", "Include Sound Design (SFX)", "Request 2 rounds of revisions"];
    }
    if (category === '3d-animation') {
      return ["Specify render engine (Octane/Redshift)", "Ask for source files", "Include lighting passes"];
    }
    return ["Specify delivery format", "Mention music licensing", "Define target platform (YT/Reels)"];
  }, [category]);

  const handleLaunchRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAnalysis(true);
  };

  const confirmSubmit = () => {
    setShowAnalysis(false);
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '120px 20px 60px' }}>
      
      {/* GhostPM ANALYSIS MODAL */}
      {showAnalysis && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '40px', borderRadius: '32px', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
              <div style={{ width: '12px', height: '12px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 15px #818cf8' }}></div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>GhostPM™ <span className="text-gradient">Brief Analysis</span></h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)' }}>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.8rem', marginBottom: '8px' }}>CLARITY SCORE: {briefFidelity}%</div>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>Your brief is highly detailed. This will likely reduce onboarding time by 14%.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(99,102,241,0.05)', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', marginBottom: '8px' }}>MARKET ALIGNMENT</div>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>The suggested budget of ${budgetMax} aligns with current high-fidelity creative benchmarks.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(245,158,11,0.05)', borderRadius: '16px', border: '1px solid rgba(245,158,11,0.1)' }}>
                <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.8rem', marginBottom: '8px' }}>POTENTIAL SCOPE CREEP</div>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>GhostPM suggests explicitly defining "Revisions" to prevent future project friction.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setShowAnalysis(false)} className="btn btn-secondary" style={{ flex: 1 }}>Edit Brief</button>
              <button onClick={confirmSubmit} className="btn btn-primary" style={{ flex: 1 }}>Confirm & Launch</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Main Form Area */}
        <div>
          <div style={{ marginBottom: '40px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '15px' }}>Project Launchpad</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Post a <span className="text-gradient">Tender</span></h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Describe your vision and let the world's best creators compete to bring it to life.</p>
          </div>

          <form onSubmit={handleLaunchRequest} className="glass-card" style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="form-group">
              <label>Project Title</label>
              <input 
                type="text" 
                className="form-control glass-liquid premium-border" 
                placeholder="e.g. Cinematic Brand Documentary for EcoTech" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-control glass-liquid premium-border" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required
              >
                <option value="">Select Category</option>
                <option value="video-editing">Video Editing</option>
                <option value="cinematography">Cinematography</option>
                <option value="3d-animation">3D Animation</option>
                <option value="vfx">VFX & Post</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project Description & Requirements</label>
              <textarea 
                className="form-control glass-liquid premium-border" 
                rows={6} 
                placeholder="Describe your project goals, style references, and technical requirements..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="form-group">
                <label>Budget Range (Min $)</label>
                <input type="number" className="form-control glass-liquid premium-border" placeholder="500" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Budget Range (Max $)</label>
                <input type="number" className="form-control glass-liquid premium-border" placeholder="2500" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Submission Deadline</label>
              <input type="date" className="form-control glass-liquid premium-border" value={deadline} onChange={e => setDeadline(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px' }}>
              <Link href="/dashboard" className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary animate-shimmer" style={{ padding: '15px 40px' }} disabled={loading}>
                {loading ? 'Launching Tender...' : 'Review & Launch'}
              </button>
            </div>
          </form>
        </div>

        {/* AI Sidebar */}
        <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          
          {/* FIDELITY SCORE */}
          <div className="glass-card" style={{ padding: '25px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9CA3AF' }}>Brief Fidelity</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: briefFidelity > 70 ? '#10b981' : '#f59e0b' }}>{briefFidelity}%</span>
            </div>
            <div style={{ height: '4px', background: '#1E2532', borderRadius: '2px' }}>
              <div style={{ width: `${briefFidelity}%`, height: '100%', background: briefFidelity > 70 ? '#10b981' : '#f59e0b', borderRadius: '2px', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
          </div>

          <div className="glass-card premium-border" style={{ padding: '25px', background: 'rgba(10,13,20,0.8)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
              <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Brief Assistant</h3>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <p style={{ fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '20px' }}>
                I recommend adding these requirements for higher quality bids:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {aiSuggestions.map((s, i) => (
                  <div key={i} onClick={() => setDesc(prev => prev + "\n- " + s)} style={{ padding: '12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <i className="fa-solid fa-plus" style={{ color: '#818cf8', marginRight: '8px' }}></i> {s}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)', fontSize: '0.75rem', color: '#D1D5DB' }}>
              <i className="fa-solid fa-circle-info" style={{ color: '#10b981', marginRight: '8px' }}></i>
              Detailed briefs attract <strong>40% more experienced</strong> creators.
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: '20px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '10px' }}>Market Interest Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{briefFidelity > 50 ? 'High' : 'Moderate'}</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '5px' }}>Top 5% of Tenders</div>
          </div>
        </aside>

      </div>
    </div>
  );
}
