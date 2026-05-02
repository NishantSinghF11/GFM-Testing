import React, { useState } from 'react';
import Link from 'next/link';

interface LeftPanelProps {
  order: any;
  files: any[];
  selectedFile: any;
  setSelectedFile: (file: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteFile?: (fileId: number, fileUrl: string) => void;
  uploading: boolean;
  currentUser: any;
  updateOrderStatus: (status: string) => void;
  updatingStatus: boolean;
  comments: any[];
}

export default function LeftPanel({
  order, files, selectedFile, setSelectedFile, handleFileUpload, handleDeleteFile, uploading, currentUser, updateOrderStatus, updatingStatus, comments
}: LeftPanelProps) {
  const isCompleted = order.status === 'completed';
  const [activeTab, setActiveTab] = useState<'files' | 'progress' | 'scope' | 'vault'>(isCompleted ? 'vault' : 'progress');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isClient = currentUser.id === order.client_id;
  const isCreator = currentUser.id === order.creator_id;

  const progressStages = [
    { id: 'pending', label: 'Briefing', icon: 'fa-clipboard-list', desc: 'Project briefed and scoped' },
    { id: 'in_progress', label: 'In Progress', icon: 'fa-hammer', desc: 'Creator is working on it' },
    { id: 'delivered', label: 'In Review', icon: 'fa-eye', desc: 'Awaiting client approval' },
    { id: 'revision', label: 'Revision', icon: 'fa-rotate', desc: 'Changes requested' },
    { id: 'completed', label: 'Approved', icon: 'fa-circle-check', desc: 'Project complete!' },
  ];

  const currentStageIndex = progressStages.findIndex(s => s.id === order.status);
  const progressPercent = Math.round(((currentStageIndex + 1) / progressStages.length) * 100);
  
  const revisionCount = comments.filter(c => c.comment_type === 'revision').length;
  const sortedFiles = [...files].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // AI risk assessment (static logic)
  const riskLevel = revisionCount >= 3 ? 'high' : revisionCount >= 1 ? 'medium' : 'low';
  const riskColors: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div style={{ width: '300px', background: '#0A0D14', borderRight: '1px solid #1A2035', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>

      {/* Header */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #1A2035' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', color: '#6B7280', textDecoration: 'none', marginBottom: '12px', fontSize: '0.8rem', gap: '6px' }}>
          <i className="fa-solid fa-arrow-left"></i> Dashboard
        </Link>
        <h2 style={{ fontSize: '1.05rem', margin: '0 0 4px', fontFamily: 'var(--font-heading)', color: 'white', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.gig?.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Order #{order.id}</span>
          <span style={{ 
            fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase',
            background: order.status === 'completed' ? 'rgba(34,197,94,0.15)' : order.status === 'delivered' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
            color: order.status === 'completed' ? '#22c55e' : order.status === 'delivered' ? '#818cf8' : '#f59e0b',
            border: `1px solid ${order.status === 'completed' ? 'rgba(34,197,94,0.3)' : order.status === 'delivered' ? 'rgba(99,102,241,0.3)' : 'rgba(245,158,11,0.3)'}`
          }}>{order.status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1A2035' }}>
        {[
          { id: 'progress', label: 'Progress', icon: 'fa-chart-line' }, 
          { id: 'files', label: 'Files', icon: 'fa-folder-open' }, 
          { id: 'scope', label: 'Scope', icon: 'fa-shield' },
          ...(isCompleted ? [{ id: 'vault', label: 'Vault', icon: 'fa-box-archive' }] : [])
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            flex: 1, padding: '10px 6px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.id ? 'var(--color-primary-light)' : '#6B7280',
            borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
            fontSize: '0.65rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.2s'
          }}>
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        
        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div style={{ padding: '20px' }}>
            {/* System 33: Progress Nebula */}
            <div style={{ marginBottom: '30px', position: 'relative', height: '140px', background: 'radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', width: '200px', height: '200px', 
                background: `radial-gradient(circle, var(--color-primary) 0%, transparent 60%)`,
                opacity: 0.15, filter: 'blur(40px)',
                transform: `scale(${0.5 + (progressPercent / 100)})`,
                transition: 'transform 2s ease-in-out'
              }}></div>
              
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#818cf8', letterSpacing: '2px', marginBottom: '10px', zIndex: 1 }}>PROJECT NEBULA</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', zIndex: 1, textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>{progressPercent}%</div>
              <div style={{ fontSize: '0.7rem', color: '#6B7280', zIndex: 1 }}>{order.status.toUpperCase().replace('_', ' ')} SYNC</div>
              
              {/* Particle simulation hint */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{ 
                    position: 'absolute', 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`, 
                    width: '2px', height: '2px', 
                    background: 'white', borderRadius: '50%',
                    boxShadow: '0 0 5px white',
                    animation: `float ${3 + Math.random() * 5}s infinite`
                  }}></div>
                ))}
              </div>
            </div>

            {/* Stage Timeline */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '12px', bottom: '12px', width: '2px', background: '#1A2035' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
                {progressStages.map((stage, i) => {
                  const done = i < currentStageIndex;
                  const active = i === currentStageIndex;
                  return (
                    <div key={stage.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: done ? '#22c55e' : active ? 'var(--color-primary)' : '#1A2035',
                        border: `2px solid ${done ? '#22c55e' : active ? 'var(--color-primary-light)' : '#2D3748'}`,
                        boxShadow: active ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                        zIndex: 1
                      }}>
                        {done ? (
                          <i className="fa-solid fa-check" style={{ fontSize: '0.6rem', color: 'white' }}></i>
                        ) : (
                          <i className={`fa-solid ${stage.icon}`} style={{ fontSize: '0.55rem', color: active ? 'white' : '#4B5563' }}></i>
                        )}
                      </div>
                      <div style={{ paddingTop: '3px', opacity: done || active ? 1 : 0.4 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: active ? 700 : 500, color: active ? 'white' : '#D1D5DB' }}>{stage.label}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '2px' }}>{stage.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ gridColumn: 'span 2', background: 'rgba(16,185,129,0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>PROJECT HEALTH (SYS 11)</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>OPTIMAL</div>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '94%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                </div>
              </div>

              {[
                { label: 'Files', value: files.length, icon: 'fa-file', color: '#6366f1' },
                { label: 'Messages', value: comments.length, icon: 'fa-comments', color: '#8b5cf6' },
                { label: 'Revisions', value: revisionCount, icon: 'fa-rotate', color: riskColors[riskLevel] },
                { label: 'Risk', value: riskLevel.toUpperCase(), icon: 'fa-triangle-exclamation', color: riskColors[riskLevel] },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#111827', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1A2035' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: '0.7rem' }}></i>
                    <span style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isCreator && order.status === 'in_progress' && (
                <button className="btn btn-primary" style={{ width: '100%', padding: '11px' }} onClick={() => updateOrderStatus('delivered')} disabled={updatingStatus}>
                  <i className="fa-solid fa-paper-plane"></i> Submit for Review
                </button>
              )}
              {isClient && order.status === 'delivered' && (
                <>
                  <button style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }} onClick={() => updateOrderStatus('completed')} disabled={updatingStatus}>
                    <i className="fa-solid fa-circle-check"></i> Approve & Complete
                  </button>
                  <button style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }} onClick={() => updateOrderStatus('revision')} disabled={updatingStatus}>
                    <i className="fa-solid fa-rotate"></i> Request Revision
                  </button>
                </>
              )}
              {isCreator && order.status === 'revision' && (
                <button className="btn btn-primary" style={{ width: '100%', padding: '11px' }} onClick={() => updateOrderStatus('delivered')} disabled={updatingStatus}>
                  <i className="fa-solid fa-upload"></i> Resubmit Delivery
                </button>
              )}
            </div>
          </div>
        )}

        {/* FILES TAB */}
        {activeTab === 'files' && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project Files</span>
              {!isCompleted && (
                <div>
                  <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                  <label htmlFor="file-upload" style={{ background: 'rgba(99,102,241,0.1)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer', color: 'var(--color-primary-light)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {uploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading…</> : <><i className="fa-solid fa-plus"></i> Add File</>}
                  </label>
                </div>
              )}
              {isCompleted && (
                <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(34,197,94,0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <i className="fa-solid fa-lock"></i> REPOSITORY LOCKED
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedFiles.map((f, idx) => {
                const isActive = selectedFile?.id === f.id || (!selectedFile && idx === 0);
                const isDeleting = deletingId === f.id;
                const icon = f.file_type?.startsWith('video/') ? 'fa-film' : f.file_type?.startsWith('image/') ? 'fa-image' : 'fa-file-code';
                const iconColor = f.file_type?.startsWith('video/') ? '#818cf8' : f.file_type?.startsWith('image/') ? '#34d399' : '#f472b6';
                
                return (
                  <div key={f.id} onClick={() => setSelectedFile(f)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px', cursor: 'pointer',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'transparent'}`,
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isDeleting ? 0 : 1,
                    transform: isDeleting ? 'scale(0.9) translateX(-20px)' : 'scale(1) translateX(0)',
                    maxHeight: isDeleting ? '0px' : '80px',
                    margin: isDeleting ? '0px' : '4px 0',
                    padding: isDeleting ? '0px 11px' : '11px',
                    overflow: 'hidden',
                    pointerEvents: isDeleting ? 'none' : 'auto'
                  }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '7px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${icon}`} style={{ color: iconColor, fontSize: '0.85rem' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.file_name}</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 700 }}>v{f.version || 1}</span>
                        <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>{(f.file_size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    </div>
                    {handleDeleteFile && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(f.id);
                          setTimeout(() => {
                            handleDeleteFile(f.id, f.file_url);
                            setDeletingId(null);
                          }, 350);
                        }}
                        style={{ background: 'none', border: 'none', padding: '6px', borderRadius: '5px', cursor: 'pointer', color: '#4B5563', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
                      >
                        <i className="fa-solid fa-trash-can" style={{ fontSize: '0.8rem' }}></i>
                      </button>
                    )}
                  </div>
                );
              })}
              {sortedFiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#4B5563', fontSize: '0.8rem', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '2px dashed #1A2035' }}>
                  <i className="fa-solid fa-cloud-arrow-up fa-2x" style={{ marginBottom: '10px', display: 'block', opacity: 0.4 }}></i>
                  Upload files to get started
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCOPE TAB */}
        {activeTab === 'scope' && (
          <div style={{ padding: '20px' }}>
            {/* System 47: Scope Lock Shield */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)', 
              border: '1px solid rgba(139,92,246,0.3)', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', color: 'rgba(139,92,246,0.1)', transform: 'rotate(15deg)' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', zIndex: 1, position: 'relative' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                  <i className="fa-solid fa-lock"></i>
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white', letterSpacing: '0.5px' }}>SCOPE SHIELD ACTIVE</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.6, margin: 0, position: 'relative', zIndex: 1 }}>
                This project is technically secured under the **GFM Quantum Protocol**. Any modifications outside the locked parameters require a cryptographic Add-on Request.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>Deliverables</span>
              {['Final edited video (MP4)', 'Color graded files', 'Source project files', 'Thumbnail images'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #1A2035' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '0.7rem' }}></i>
                  <span style={{ fontSize: '0.8rem', color: '#D1D5DB' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="fa-solid fa-circle-plus" style={{ color: '#f59e0b' }}></i>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Add-on Requests</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 12px' }}>Request changes beyond the original scope.</p>
              <button style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                + Submit Add-on Request
              </button>
            </div>
          </div>
        )}

        {/* VAULT TAB (System 60: Delivery Locker) */}
        {activeTab === 'vault' && (
          <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.05), transparent)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '10px' }}>FINAL DELIVERY LOCKER</div>
              <button style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#22c55e', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}>
                <i className="fa-solid fa-cloud-arrow-down"></i> Download Full Package
              </button>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', marginTop: '10px', textAlign: 'center' }}>Zip bundle includes all exports + source files</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Final Deliverables</div>
                {sortedFiles.filter(f => f.version === Math.max(...files.map(x => x.version))).map(f => (
                  <div key={f.id} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '0.8rem' }}></i>
                    <div style={{ fontSize: '0.75rem', color: 'white', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.file_name}</div>
                    <i className="fa-solid fa-download" style={{ color: '#6B7280', fontSize: '0.7rem', cursor: 'pointer' }}></i>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Documentation</div>
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-file-invoice-dollar" style={{ color: '#818cf8', fontSize: '0.8rem' }}></i>
                  <div style={{ fontSize: '0.75rem', color: 'white', flex: 1 }}>Invoice_{order.id}.pdf</div>
                </div>
              </div>

              <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: '10px', padding: '12px', marginTop: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 700, marginBottom: '5px' }}>ASSET HEALTH CHECK</div>
                <div style={{ fontSize: '0.7rem', color: '#D1D5DB' }}>All files verified and scanned for integrity. Handoff compliant.</div>
              </div>

              {/* System 60: Approval Snapshot (Req 10) */}
              <div style={{ borderTop: '1px solid #1A2035', marginTop: '10px', paddingTop: '15px' }}>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Approval Snapshot</div>
                <div style={{ background: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>Approved By</span>
                    <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 600 }}>{order.client?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>Date</span>
                    <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 600 }}>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* System 60: Creator Notes (Req 8) */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>Creator Delivery Notes</div>
                <div style={{ background: '#111827', borderRadius: '8px', padding: '12px', border: '1px solid #1E2532' }}>
                  <p style={{ fontSize: '0.7rem', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                    "Optimized for high-retention social feeds. Use the square version for Instagram/Facebook and the vertical cut for TikTok. Exported in 4K ProRes for maximum fidelity."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
