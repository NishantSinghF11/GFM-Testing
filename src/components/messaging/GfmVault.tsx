"use client";

import React, { useState } from 'react';
import { VaultItem, Milestone, CurrentUser } from './types';
import ResolutionCenter from './ResolutionCenter';
import DigitalContract from './DigitalContract';
import ProgressNebula from '@/components/ui/ProgressNebula';

interface GfmVaultProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  addToast: (text: string, icon?: string) => void;
}

export default function GfmVault({ isOpen, onClose, currentUser, addToast }: GfmVaultProps) {
  const [activeTab, setActiveTab] = useState<'deliverables' | 'milestones' | 'escrow' | 'payments'>('deliverables');
  const [showResolutionCenter, setShowResolutionCenter] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [intelMode, setIntelMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // System 38: Quantum Payment State
  const [escrowStatus, setEscrowStatus] = useState({
    total: 2500,
    released: 1200,
    pending: 1300,
    isStreaming: false
  });
  
  // Mock Data
  const [deliverables, setDeliverables] = useState<VaultItem[]>([
    { id: '1', name: 'Cinematic_Reel_V1.mp4', size: '42.5 MB', type: 'video', status: 'review', uploaded_at: '2 hours ago', version: 1 },
    { id: '2', name: 'Thumbnail_Draft.png', size: '2.1 MB', type: 'image', status: 'approved', uploaded_at: '1 day ago', version: 2 }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Initial Concept & Script', amount: '$150', status: 'released', due_date: 'Oct 20' },
    { id: '2', title: 'Production & Editing', amount: '$250', status: 'funded', due_date: 'Oct 25' },
    { id: '3', title: 'Final Handover', amount: '$100', status: 'pending', due_date: 'Oct 30' }
  ]);

  if (!isOpen) return null;

  const isClient = currentUser.role === 'client';

  const handleApprove = (id: string) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    addToast('Deliverable Approved!', 'fa-circle-check');
  };

  const handleReleaseFunds = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'released' } : m));
    addToast('Funds Released to Creator!', 'fa-hand-holding-dollar');
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            addToast('Quantum Delivery Complete!', 'fa-cloud-check');
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', background: '#0A0D14', borderLeft: '1px solid #1E2532', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)', animation: 'slideIn 0.3s ease-out' }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />

      {/* Header */}
      <div style={{ padding: '25px', borderBottom: '1px solid #1E2532', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(16,185,129,0.05) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <i className="fa-solid fa-vault"></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>GFM Vault</h3>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Secure Asset Management</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '5px' }}>
        {[
          { id: 'deliverables', label: 'Files', icon: 'fa-file-lines' },
          { id: 'milestones', label: 'Timeline', icon: 'fa-list-check' },
          { id: 'escrow', label: 'Escrow', icon: 'fa-shield-halved' },
          { id: 'payments', label: 'Payments', icon: 'fa-bolt-lightning' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ flex: 1, padding: '12px', background: activeTab === tab.id ? '#1E2532' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === tab.id ? 'white' : '#6B7280', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 15px', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '0.55rem', color: intelMode ? '#818cf8' : '#6B7280', fontWeight: 800 }}>INTEL</span>
          <button 
            onClick={() => setIntelMode(!intelMode)}
            style={{ width: '30px', height: '16px', background: intelMode ? '#818cf8' : 'rgba(255,255,255,0.1)', borderRadius: '8px', position: 'relative', border: 'none' }}
          >
            <div style={{ position: 'absolute', top: '2px', left: intelMode ? '16px' : '2px', width: '12px', height: '12px', background: 'white', borderRadius: '50%', transition: 'all 0.2s' }}></div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
        
        {activeTab === 'payments' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)' }}>
                <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, marginBottom: '5px' }}>RELEASED</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>${escrowStatus.released}</div>
              </div>
              <div style={{ padding: '15px', background: 'rgba(129,140,248,0.05)', borderRadius: '16px', border: '1px solid rgba(129,140,248,0.1)' }}>
                <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 800, marginBottom: '5px' }}>PENDING</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>${escrowStatus.pending}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid #1E2532' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-stream" style={{ color: '#818cf8' }}></i>
                QUANTUM LEDGER (SYS 38)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { item: "Bali Reel v2 (30s)", type: "Streaming", status: "Active", amount: 450 },
                  { item: "Drone Footage (Raw)", type: "Fixed", status: "Pending", amount: 800 }
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#05070B', borderRadius: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{log.item}</div>
                      <div style={{ fontSize: '0.6rem', color: '#6B7280' }}>{log.type} Payout</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#818cf8' }}>+${log.amount}</div>
                      <div style={{ fontSize: '0.55rem', color: '#10b981', fontWeight: 900 }}>SECURED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setEscrowStatus(prev => ({ ...prev, released: prev.released + 300, pending: prev.pending - 300 }));
                addToast("Quantum Payment Released: $300 streaming to creator.", "success");
              }}
              className="btn btn-primary" 
              style={{ padding: '15px', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              <i className="fa-solid fa-money-bill-transfer" style={{ marginRight: '10px' }}></i>
              Release $300 Milestone
            </button>
          </div>
        )}

        {activeTab === 'deliverables' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {deliverables.map(file => (
              <div key={file.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '16px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#05070B', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      <i className={`fa-solid ${file.type === 'video' ? 'fa-file-video' : 'fa-file-image'}`} style={{ color: '#818cf8' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{file.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{file.size} • v{file.version} • {file.uploaded_at}</div>
                    </div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', background: file.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: file.status === 'approved' ? '#10b981' : '#f59e0b', height: 'fit-content' }}>
                    {file.status}
                  </div>
                </div>

                {intelMode && (
                  <div className="animate-fade-in" style={{ marginBottom: '15px', padding: '15px', background: 'rgba(129,140,248,0.03)', borderRadius: '12px', border: '1px solid rgba(129,140,248,0.1)' }}>
                    <div style={{ fontSize: '0.6rem', color: '#818cf8', fontWeight: 800, marginBottom: '10px' }}>SYSTEM 31: LOOM FRAME FEEDBACK 🎞️</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#D1D5DB' }}><span style={{ color: '#818cf8' }}>[00:12]</span> "Adjust contrast on product focus"</div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800, marginBottom: '10px' }}>SYSTEM 35: SMART-TRIM PREVIEWS 📱</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'white' }}>9:16 Social Crop</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Preview</button>
                  {isClient && file.status === 'review' && (
                    <>
                      <button onClick={() => addToast('Revision requested', 'fa-rotate-left')} style={{ flex: 1, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>Revise</button>
                      <button onClick={() => handleApprove(file.id)} style={{ flex: 1, background: '#10b981', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {!isClient && (
              <button 
                onClick={simulateUpload}
                style={{ width: '100%', border: '2px dashed #1E2532', background: 'transparent', color: '#9CA3AF', padding: '20px', borderRadius: '16px', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <i className="fa-solid fa-cloud-arrow-up" style={{ display: 'block', fontSize: '1.5rem', marginBottom: '10px' }}></i>
                Test Quantum Upload
              </button>
            )}
          </div>
        )}

        {/* Quantum Upload Overlay */}
        {isUploading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,7,10,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
            <ProgressNebula progress={uploadProgress} />
            <div style={{ marginTop: '20px', color: '#9CA3AF', fontSize: '0.8rem', letterSpacing: '1px' }}>SYNCING WITH GFM PROTOCOL...</div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: '#1E2532' }}></div>
            {milestones.map((m, idx) => (
              <div key={m.id} style={{ marginBottom: '30px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-19px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: m.status === 'released' ? '#10b981' : m.status === 'funded' ? '#818cf8' : '#374151', border: '3px solid #0A0D14' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.title}</div>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>{m.amount}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Due {m.due_date}</div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: m.status === 'released' ? '#10b981' : m.status === 'funded' ? '#818cf8' : '#9CA3AF' }}>{m.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'escrow' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1E2532 0%, #05070B 100%)', border: '1px solid #10b981', borderRadius: '24px', padding: '30px', textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '10px', textTransform: 'uppercase' }}>Secured in GFM Vault</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '15px' }}>$350.00</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.75rem', color: '#10b981' }}>
                <i className="fa-solid fa-lock"></i> 100% Protected
              </div>
              <button 
                onClick={() => setShowContract(true)}
                style={{ marginTop: '20px', width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <i className="fa-solid fa-file-contract" style={{ marginRight: '8px' }}></i> View Digital Contract
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>Ready for Release</h4>
              {milestones.filter(m => m.status === 'funded').map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{m.amount}</div>
                  </div>
                  {isClient && (
                    <button onClick={() => handleReleaseFunds(m.id)} style={{ background: '#10b981', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Release</button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6B7280', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>
              Releasing funds signals that you are 100% satisfied with the deliverable. This action cannot be undone.
            </div>

            {/* Resolution Center Trigger */}
            <div style={{ marginTop: '25px', padding: '20px', border: '1px solid #1E2532', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '5px' }}>Having issues?</div>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: '#9CA3AF' }}>If the work isn't as described or the creator is unresponsive, use our AI mediator.</p>
              <button 
                onClick={() => setShowResolutionCenter(true)}
                style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <i className="fa-solid fa-scale-balanced" style={{ marginRight: '8px' }}></i> Open Resolution Center
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div style={{ padding: '20px 25px', borderTop: '1px solid #1E2532', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <i className="fa-solid fa-shield-check" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4 }}>
            All transactions and file sharing within the Vault are encrypted and protected by GFM Escrow terms.
          </div>
        </div>
      </div>

      {/* Resolution Center Modal Overlay */}
      <ResolutionCenter 
        isOpen={showResolutionCenter} 
        onClose={() => setShowResolutionCenter(false)} 
        currentUser={currentUser}
        activeOffer={null}
        addToast={addToast}
      />

      {/* Digital Contract Modal */}
      <DigitalContract 
        isOpen={showContract}
        onClose={() => setShowContract(false)}
        currentUser={currentUser}
        offerData={null}
      />
    </div>
  );
}
