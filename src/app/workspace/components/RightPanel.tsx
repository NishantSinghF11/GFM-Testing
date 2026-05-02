import React, { useRef, useEffect, useState } from 'react';

interface RightPanelProps {
  comments: any[];
  currentUser: any;
  order: any;
  timecode: string;
  setTimecode: (val: string) => void;
  commentText: string;
  setCommentText: (val: string) => void;
  commentType: string;
  setCommentType: (val: string) => void;
  handlePostComment: () => void;
  onTimecodeClick: (tc: string) => void;
  pendingAnnotation?: string | null;
  setPendingAnnotation?: (val: string | null) => void;
  sending?: boolean;
}

const AI_SUGGESTIONS = [
  'Looks great so far!',
  'Can you adjust the color grading?',
  'I love the transitions.',
  'The audio sync is off slightly.',
  'Please sharpen the intro sequence.',
  'This section needs more energy.',
];

export default function RightPanel({
  comments, currentUser, order, timecode, setTimecode, commentText, setCommentText, commentType, setCommentType, handlePostComment, onTimecodeClick,
  pendingAnnotation, setPendingAnnotation, sending
}: RightPanelProps) {
  const isCompleted = order.status === 'completed';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics' | 'command'>(isCompleted ? 'command' : 'chat');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const formatTimeAgo = (dateStr: string) => {
    const sec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const revisions = comments.filter(c => c.comment_type === 'revision').length;
  const approvals = comments.filter(c => c.comment_type === 'approved').length;
  const responseRates = comments.length > 1
    ? Math.max(0, 100 - revisions * 20)
    : 100;

  const typeConfig: Record<string, { label: string; border: string; bg: string; tagBg: string; tagColor: string }> = {
    general: { label: '', border: '#1A2035', bg: 'rgba(255,255,255,0.02)', tagBg: '', tagColor: '' },
    revision: { label: 'REVISION', border: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.04)', tagBg: 'rgba(245,158,11,0.15)', tagColor: '#f59e0b' },
    approved: { label: 'APPROVED', border: 'rgba(34,197,94,0.25)', bg: 'rgba(34,197,94,0.04)', tagBg: 'rgba(34,197,94,0.15)', tagColor: '#22c55e' },
  };

  return (
    <div style={{ width: '380px', background: '#0A0D14', borderLeft: '1px solid #1A2035', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>

      <div style={{ display: 'flex', borderBottom: '1px solid #1A2035' }}>
        {[
          { id: 'chat', label: isCompleted ? 'Archive' : 'Team Chat', icon: 'fa-comments' }, 
          { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' },
          ...(isCompleted ? [{ id: 'command', label: 'Command', icon: 'fa-terminal' }] : [])
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{
            flex: 1, padding: '14px 8px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.id ? 'white' : '#6B7280',
            borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
            fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
          }}>
            <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Total Messages', value: comments.length, icon: 'fa-message', color: '#818cf8' },
              { label: 'Revisions', value: revisions, icon: 'fa-rotate', color: '#f59e0b' },
              { label: 'Approvals', value: approvals, icon: 'fa-circle-check', color: '#22c55e' },
              { label: 'Satisfaction', value: `${responseRates}%`, icon: 'fa-face-smile', color: '#34d399' },
            ].map(s => (
              <div key={s.label} style={{ background: '#111827', padding: '14px', borderRadius: '10px', border: '1px solid #1E2532' }}>
                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, marginBottom: '8px', display: 'block' }}></i>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Satisfaction bar */}
          <div style={{ background: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #1E2532' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Client Satisfaction Score</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>{responseRates}%</span>
            </div>
            <div style={{ height: '6px', background: '#1A2035', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${responseRates}%`, background: 'linear-gradient(90deg, #6366f1, #34d399)', transition: 'width 0.6s ease' }}></div>
            </div>
          </div>

          {/* Gamification */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(167,139,250,0.1))', padding: '16px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <i className="fa-solid fa-medal" style={{ color: '#f59e0b', fontSize: '1.4rem' }}></i>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Pro Creator</div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>Level 4 • 1,240 XP</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { label: 'Fast Delivery', icon: 'fa-bolt', color: '#f59e0b' },
                { label: 'No Revisions', icon: 'fa-shield', color: '#22c55e' },
                { label: '5★ Rated', icon: 'fa-star', color: '#818cf8' },
              ].map(badge => (
                <div key={badge.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1E2532', fontSize: '0.65rem', color: '#D1D5DB' }}>
                  <i className={`fa-solid ${badge.icon}`} style={{ color: badge.color, fontSize: '0.6rem' }}></i> {badge.label}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6B7280' }}>Next badge: <span style={{ color: '#818cf8' }}>Elite Deliverer</span> (240 XP away)</div>
          </div>

          {/* Payment status */}
          <div style={{ background: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #1E2532' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-lock'}`} style={{ color: '#22c55e' }}></i>
              <span style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{isCompleted ? 'Payment Released' : 'Escrow Status'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>${Number(order.total_price).toFixed(0)}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{isCompleted ? 'Funds transferred to creator' : 'Held in escrow • Releases on approval'}</div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', color: '#22c55e', fontWeight: 700 }}>{isCompleted ? 'PAID' : 'SECURED'}</div>
            </div>
          </div>

          {/* System 18: Activity Pulse */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#6B7280', letterSpacing: '1px', marginBottom: '15px' }}>ACTIVITY PULSE (SYS 18)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { time: "02:14", text: "Quantum Naming Engine sanitized v2_final", icon: "fa-tag", color: "#818cf8" },
                { time: "01:45", text: "Drift detected: 0.002% shift in color profile", icon: "fa-chart-line", color: "#f59e0b" },
                { time: "00:30", text: "Shadow Draft generated for frame sync", icon: "fa-wand-magic-sparkles", color: "#10b981" }
              ].map((pulse, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '2px', height: '12px', background: pulse.color, borderRadius: '1px' }}></div>
                  <span style={{ fontSize: '0.65rem', color: '#4B5563', fontFamily: 'monospace' }}>{pulse.time}</span>
                  <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{pulse.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMMAND TAB (System 60: Command Center) */}
      {activeTab === 'command' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* System 60: Client Satisfaction Pulse (Req 13) */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px', marginBottom: '12px' }}>SATISFACTION PULSE</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 500 }}>Process was smooth?</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', color: '#6B7280', fontSize: '0.8rem', cursor: 'pointer' }}><i className="fa-solid fa-thumbs-down"></i></button>
                <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '0.8rem', cursor: 'pointer' }}><i className="fa-solid fa-thumbs-up"></i></button>
              </div>
            </div>
            <button style={{ width: '100%', marginTop: '12px', padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px dashed #374151', color: '#9CA3AF', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
              <i className="fa-solid fa-heart"></i> Add to Favorite Creators
            </button>
          </div>

          {/* Post-Delivery Support */}
          <div style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px' }}>SUPPORT WINDOW ACTIVE</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>7 Days Left</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-circle-question"></i> Usage Help
              </button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-wrench"></i> Minor Fix
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <i className="fa-solid fa-repeat"></i> Rehire for Next Phase
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', color: '#D1D5DB', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-copy"></i> Duplicate
              </button>
              <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', color: '#D1D5DB', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <i className="fa-solid fa-share-nodes"></i> Share
              </button>
            </div>
          </div>

          {/* Variant Generator */}
          <div style={{ background: '#111827', borderRadius: '12px', border: '1px solid #1E2532', padding: '16px' }}>
            <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 900, letterSpacing: '1px', marginBottom: '12px' }}>VARIANT GENERATOR</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Square Cut', icon: 'fa-square' },
                { label: 'Vertical (9:16)', icon: 'fa-mobile-screen' },
                { label: 'Short Version', icon: 'fa-scissors' },
                { label: 'Subtitles', icon: 'fa-closed-captioning' }
              ].map(v => (
                <button key={v.label} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', color: 'white', fontSize: '0.7rem', fontWeight: 600, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <i className={`fa-solid ${v.icon}`} style={{ color: '#818cf8' }}></i> {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Case Study */}
          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 900, letterSpacing: '1px' }}>AI CASE STUDY GEN</div>
              <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 800 }}>READY</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '12px' }}>I've drafted a case study for this project highlighting the 2 revisions and 100% satisfaction score.</p>
            <button style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Review & Post to Portfolio
            </button>
          </div>

          {/* Asset Reuse Hub */}
          <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 900, letterSpacing: '1px', marginBottom: '8px' }}>SMART REUSE HUB</div>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '12px' }}>Adapt these assets for other active projects or campaigns.</div>
            <button style={{ background: 'none', border: '1px dashed #374151', width: '100%', padding: '10px', borderRadius: '8px', color: '#6B7280', fontSize: '0.75rem', cursor: 'pointer' }}>
              + Map to Campaign
            </button>
          </div>
        </div>
      )}
      {activeTab === 'chat' && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#374151', textAlign: 'center', padding: '40px 20px' }}>
                <i className="fa-regular fa-comments fa-3x" style={{ marginBottom: '16px', opacity: 0.3 }}></i>
                <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>No messages yet.<br />Start the conversation.</p>
              </div>
            )}
            {comments.map(c => {
              const prof = c.author;
              const initials = prof?.initials || '??';
              const color = prof?.cover_color || '#6366f1';
              const name = prof?.name || 'User';
              const isMe = c.author_id === currentUser.id;
              const isCreatorMsg = c.author_id === order.creator_id;
              const cfg = typeConfig[c.comment_type] || typeConfig.general;
              
              // System 55.2.1: Parse Embedded Annotation
              const annotationMatch = c.text?.match(/\[ANNOTATION:(.*?)\]/);
              const annotationUrl = annotationMatch ? annotationMatch[1] : null;
              const cleanText = c.text?.replace(/\[ANNOTATION:.*?\]/, '').trim();
              
              return (
                <div key={c.id} style={{ border: `1px solid ${cfg.border}`, background: cfg.bg, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>{initials}</div>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{isMe ? 'You' : name}</span>
                        {isCreatorMsg && <span style={{ fontSize: '0.6rem', color: '#818cf8', marginLeft: '5px', fontWeight: 600 }}>Creator</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#6B7280', flexShrink: 0 }}>{formatTimeAgo(c.created_at)}</span>
                  </div>
                  
                  <div style={{ paddingLeft: '36px' }}>
                    {cfg.label && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', padding: '2px 7px', borderRadius: '4px', background: cfg.tagBg, color: cfg.tagColor, fontWeight: 700, marginBottom: '6px' }}>
                        {cfg.label}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                      {c.timecode && (
                        <button onClick={() => onTimecodeClick(c.timecode)} style={{
                          background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '0.72rem', padding: '2px 7px',
                          borderRadius: '4px', fontWeight: 700, border: '1px solid rgba(99,102,241,0.3)', cursor: 'pointer', flexShrink: 0,
                          transition: 'all 0.15s'
                        }}>
                          <i className="fa-solid fa-clock" style={{ marginRight: '3px', fontSize: '0.6rem' }}></i>{c.timecode}
                        </button>
                      )}
                      <span style={{ fontSize: '0.85rem', lineHeight: 1.55, color: '#D1D5DB' }}>{cleanText}</span>
                    </div>

                    {/* System 55.2: Annotation Snapshot Display */}
                    {annotationUrl && (
                      <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                        <img 
                          src={annotationUrl} 
                          alt="Annotation Snapshot" 
                          style={{ width: '100%', display: 'block', cursor: 'zoom-in' }}
                          onClick={() => {
                            if (c.timecode) onTimecodeClick(c.timecode);
                            window.open(annotationUrl, '_blank');
                          }}
                        />
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(139,92,246,0.85)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, color: 'white', backdropFilter: 'blur(4px)' }}>
                          <i className="fa-solid fa-pen-nib" style={{ marginRight: '5px' }}></i>MARKUP SNAPSHOT
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input / Freeze Banner */}
          {!isCompleted ? (
            <div style={{ padding: '16px', borderTop: '1px solid #1A2035', background: '#060810' }}>
              
              {/* System 55.2: Pending Annotation Preview */}
              {pendingAnnotation && (
                <div style={{ marginBottom: '12px', position: 'relative', width: '100px' }}>
                  <img src={pendingAnnotation} style={{ width: '100%', borderRadius: '6px', border: '1px solid #818cf8', opacity: 0.8 }} />
                  <button 
                    onClick={() => setPendingAnnotation && setPendingAnnotation(null)}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', fontSize: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                  <div style={{ fontSize: '0.6rem', color: '#818cf8', marginTop: '4px', fontWeight: 700 }}>SNAPSHOT STAGED</div>
                </div>
              )}
              
              {/* Type selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {[
                  { id: 'general', label: 'Comment', icon: 'fa-message' },
                  { id: 'revision', label: 'Revision', icon: 'fa-rotate', activeColor: '#f59e0b' },
                  { id: 'approved', label: 'Approve', icon: 'fa-circle-check', activeColor: '#22c55e' },
                ].map(type => {
                  const isActive = commentType === type.id;
                  const accent = (type as any).activeColor || 'var(--color-primary-light)';
                  return (
                    <button key={type.id} onClick={() => setCommentType(type.id)} style={{
                      flex: 1, padding: '6px 4px', borderRadius: '6px', border: `1px solid ${isActive ? accent : '#1E2532'}`,
                      background: isActive ? `rgba(${type.id === 'revision' ? '245,158,11' : type.id === 'approved' ? '34,197,94' : '99,102,241'},0.1)` : 'transparent',
                      color: isActive ? accent : '#6B7280', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.15s'
                    }}>
                      <i className={`fa-solid ${type.icon}`} style={{ fontSize: '0.65rem' }}></i> {type.label}
                    </button>
                  );
                })}
              </div>

              {/* Timecode + text row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text" placeholder="00:00" value={timecode}
                  onChange={(e) => setTimecode(e.target.value)}
                  style={{ width: '58px', textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem', padding: '10px 6px', background: '#111827', border: '1px solid #1E2532', borderRadius: '6px', color: 'white', outline: 'none' }}
                  title="Timecode"
                />
                <input
                  type="text" placeholder="Type a message…" value={commentText}
                  onChange={(e) => { setCommentText(e.target.value); if (e.target.value.length > 2) setShowSuggestions(true); else setShowSuggestions(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostComment(); setShowSuggestions(false); } }}
                  style={{ flex: 1, padding: '10px 12px', background: '#111827', border: '1px solid #1E2532', borderRadius: '6px', color: 'white', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>

              {/* Neural Co-pilot (System 16) */}
              <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 900, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-brain"></i> NEURAL CO-PILOT (SYS 16)
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Shadow Draft', icon: 'fa-wand-magic-sparkles' },
                    { label: 'Frame Lock', icon: 'fa-lock' },
                    { label: 'Asset Sync', icon: 'fa-rotate' }
                  ].map((action, i) => (
                    <button key={i} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className={`fa-solid ${action.icon}`}></i> {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              {showSuggestions && (
                <div style={{ background: '#111827', border: '1px solid #1E2532', borderRadius: '8px', padding: '8px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-solid fa-sparkles" style={{ color: '#818cf8' }}></i> Smart Replies
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {AI_SUGGESTIONS.slice(0, 3).map((s, i) => (
                      <button key={i} onClick={() => { setCommentText(s); setShowSuggestions(false); }} style={{
                        padding: '4px 10px', borderRadius: '20px', border: '1px solid #374151', background: 'rgba(255,255,255,0.03)', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.7rem', transition: 'all 0.15s'
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Send row */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button title="Voice note (coming soon)" style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#111827', border: '1px solid #1E2532', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-microphone"></i>
                </button>
                <button
                  onClick={() => { handlePostComment(); setShowSuggestions(false); }}
                  disabled={sending || (!commentText.trim() && !pendingAnnotation)}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '8px', 
                    background: (commentText.trim() || pendingAnnotation) ? (sending ? 'rgba(99,102,241,0.5)' : 'var(--color-primary)') : '#1A2035', 
                    border: 'none', color: (commentText.trim() || pendingAnnotation) ? 'white' : '#4B5563', 
                    cursor: (commentText.trim() || pendingAnnotation) && !sending ? 'pointer' : 'not-allowed', 
                    fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {sending ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> SYNCING...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i> SEND</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(34,197,94,0.2)', background: 'rgba(34,197,94,0.05)', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.2rem' }}></i>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>PROJECT FINALIZED</div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>The review thread is now frozen. All assets are archived.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
