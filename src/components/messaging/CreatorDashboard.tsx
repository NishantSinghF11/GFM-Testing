"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DashboardProps } from './types';
import OfferCountdown from '@/components/ui/OfferCountdown';
import NotificationCenter from '@/components/ui/NotificationCenter';
import CreatorAnalytics from '@/components/dashboard/CreatorAnalytics';
import PreVizViewer from './PreVizViewer';
import GhostVault from './GhostVault';
import DeepSign from '@/components/ui/DeepSign';

export default function CreatorDashboard({
  currentUser,
  conversations,
  activeConversation,
  setActiveConversation,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  handleSendSmartOffer,
  pipelineStage,
  clientActivity,
  dealConfidence,
  showOfferComposer,
  setShowOfferComposer,
  offerPrice,
  setOfferPrice,
  offerTimeline,
  setOfferTimeline,
  offerDeliverables,
  setOfferDeliverables,
  offerRevisions,
  setOfferRevisions,
  toasts,
  addToast,
  handleVariantChange,
  handleGenerateAIVariants,
  isGenerating,
  activeVariant,
  showComparison,
  setShowComparison,
  showAIReasoning,
  setShowAIReasoning,
  showCheckoutPreview,
  setShowCheckoutPreview,
  setSelectedOfferForCheckout,
  showVault,
  setShowVault
}: DashboardProps) {
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'intelligence'>('chat');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // --- LOCAL CREATOR TOOLS ---
  const FFM_FEE = 0.20; // 20% platform fee
  
  const netEarnings = useMemo(() => {
    const price = parseFloat(offerPrice.replace(/[^0-9.]/g, '')) || 0;
    return (price * (1 - FFM_FEE)).toFixed(2);
  }, [offerPrice]);

  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreViz, setShowPreViz] = useState(false);
  const [showDeepSign, setShowDeepSign] = useState(false);

  const mockPreVizFrames = [
    { id: 'f1', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop', label: 'Color Grading: Teal & Orange' },
    { id: 'f2', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop', label: 'Composition: Wide Angle Cinematic' },
    { id: 'f3', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=450&fit=crop', label: 'Lighting: Golden Hour / Soft Glow' },
    { id: 'f4', url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&h=450&fit=crop', label: 'Transitions: Smooth Kinetic Motion' }
  ];
  const templates = [
    { title: "Intro & Availability", text: "Hey! I'm definitely available for this project. Based on your requirements, I can start as early as tomorrow." },
    { title: "Price Negotiation", text: "I understand your budget. How about we adjust the deliverables slightly to meet that price point? For example, we could [omit X]." },
    { title: "Final Handover", text: "I've completed the work! Please review the final files attached. If everything looks good, please approve the milestone." }
  ];

  const generateAIReplies = () => {
    if (activeConversation?.emotion === 'frustrated') return ["I understand your concern. Let me fix that.", "Can we hop on a quick call to resolve this?"];
    if (pipelineStage === 'inquiry') return ["I'm available! What's your exact budget?", "I can definitely help with this. Have references?"];
    if (pipelineStage === 'negotiation') return ["I can do $400 if we remove the source file.", "I'll send a custom Smart Offer now."];
    return ["Thank you! I will begin immediately.", "Please review the Escrow details."];
  };

  return (
    <div style={{ background: '#05070B', height: 'calc(100vh - 70px)', display: 'flex', overflow: 'hidden', color: 'white', position: 'relative' }}>
      
      {/* MOBILE NAV BAR (Only visible on small screens) */}
      <div className="mobile-nav-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', background: 'rgba(10, 13, 20, 0.95)', backdropFilter: 'blur(15px)', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 1000, display: 'none', padding: '0 20px', alignItems: 'center', justifyContent: 'space-around' }}>
        <button onClick={() => setMobileView('list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'list' ? '#818cf8' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-list-check" style={{ fontSize: '1.2rem' }}></i> List
        </button>
        <button onClick={() => setMobileView('chat')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'chat' ? '#818cf8' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-comments" style={{ fontSize: '1.2rem' }}></i> Chat
        </button>
        <button onClick={() => setMobileView('intelligence')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'intelligence' ? '#818cf8' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-brain" style={{ fontSize: '1.2rem' }}></i> AI
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .mobile-nav-bar { display: flex !important; }
          .creator-sidebar { display: ${mobileView === 'list' ? 'flex' : 'none'} !important; width: 100% !important; }
          .creator-main { display: ${mobileView === 'chat' ? 'flex' : 'none'} !important; }
          .creator-intelligence { display: ${mobileView === 'intelligence' ? 'flex' : 'none'} !important; width: 100% !important; position: fixed; inset: 0; z-index: 50; }
        }
      `}} />

      {/* MICRO-FEEDBACK TOASTS */}
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(10px)', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}>
            <i className={`fa-solid ${toast.icon}`}></i> {toast.text}
          </div>
        ))}
      </div>

      {/* LEFT COLUMN: Deal Pipeline Sidebar */}
      <div className="creator-sidebar" style={{ width: '320px', borderRight: '1px solid #1E2532', background: '#0A0D14', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1E2532' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 15px 0', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Deal Pipeline <i className="fa-solid fa-filter" style={{ fontSize: '0.9rem', color: '#6B7280', cursor: 'pointer' }}></i>
          </h2>
          
          {/* NEW PROMINENT ANALYTICS BUTTON */}
          <button 
            onClick={() => { setShowAnalytics(!showAnalytics); setMobileView('intelligence'); }}
            style={{ width: '100%', marginBottom: '15px', background: showAnalytics ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.05)', border: showAnalytics ? '1px solid #6366f1' : '1px solid rgba(99,102,241,0.2)', padding: '12px', borderRadius: '12px', color: showAnalytics ? '#818cf8' : 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: showAnalytics ? '0 0 15px rgba(99,102,241,0.2)' : 'none' }}
          >
            <i className="fa-solid fa-chart-pie"></i> {showAnalytics ? 'Back to Deal AI' : 'Business Insights'}
          </button>

          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1E2532', borderRadius: '12px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-search" style={{ color: '#6B7280' }}></i>
            <input type="text" placeholder="Search deals..." style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(conv => (
            <div key={conv.user_id} onClick={() => setActiveConversation(conv)} style={{ padding: '20px', borderBottom: '1px solid #1E2532', cursor: 'pointer', transition: 'all 0.2s', background: activeConversation?.user_id === conv.user_id ? 'rgba(99,102,241,0.05)' : 'transparent', borderLeft: activeConversation?.user_id === conv.user_id ? '3px solid #6366f1' : '3px solid transparent' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `linear-gradient(135deg, ${conv.cover_color}, #1E2532)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'white', boxShadow: conv.heat === 'hot' ? '0 0 15px rgba(239,68,68,0.4)' : 'none' }}>
                    {conv.initials}
                  </div>
                  {conv.heat === 'hot' && <div style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '1rem', background: '#0A0D14', borderRadius: '50%', padding: '2px' }}>🔥</div>}
                  {conv.heat === 'warm' && <div style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '1rem', background: '#0A0D14', borderRadius: '50%', padding: '2px' }}>🟡</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{conv.last_time}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: conv.unread ? 'white' : '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: conv.unread ? 600 : 400, marginBottom: '8px' }}>
                    {conv.last_message}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {conv.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '8px', background: tag === 'Urgent' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', color: tag === 'Urgent' ? '#ef4444' : '#818cf8', fontWeight: 600, textTransform: 'uppercase' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER COLUMN: Negotiation Stage */}
      <div className="creator-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#05070B', position: 'relative' }}>
        {activeConversation ? (
          <>
            {/* Header & Stats */}
            <div style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,13,20,0.95)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {activeConversation.name}
                  {activeConversation.heat === 'hot' && <span style={{ fontSize: '0.7rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '12px', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)' }}>HOT DEAL 🔥</span>}
                </h3>
                <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deal Value</div>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>$1,250</div>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Probability</div>
                    <div style={{ fontWeight: 700, color: '#818cf8' }}>92%</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <NotificationCenter />
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                <button onClick={() => setShowVault(true)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-vault"></i> VAULT
                </button>
                <Link href="/studio/proj-2241" style={{ textDecoration: 'none', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#818cf8', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-clapperboard"></i> STUDIO
                </Link>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.1rem', cursor: 'pointer' }}><i className="fa-solid fa-phone"></i></button>
                <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.1rem', cursor: 'pointer' }}><i className="fa-solid fa-video"></i></button>
              </div>
            </div>

            {/* Pipeline Stage Visualization */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
              {['inquiry', 'negotiation', 'offer', 'accepted'].map((stage, idx) => {
                const isActive = pipelineStage === stage;
                const isPast = ['inquiry', 'negotiation', 'offer', 'accepted'].indexOf(pipelineStage) > idx;
                return (
                  <div key={stage} style={{ flex: 1, position: 'relative' }}>
                    <div style={{ height: '4px', background: isPast || isActive ? '#6366f1' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.5s' }}></div>
                    <div style={{ marginTop: '8px', fontSize: '0.65rem', fontWeight: 700, color: isActive ? 'white' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{stage}</span>
                      {isPast && <i className="fa-solid fa-check" style={{ color: '#6366f1' }}></i>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* AI PRE-VIZ INJECTION */}
                {showPreViz && (
                  <PreVizViewer 
                    frames={mockPreVizFrames} 
                    styleDirection="High-contrast cinematic travel aesthetic with focus on fluid transitions and natural color preservation. Tone is aspirational and energetic."
                    onApprove={() => setShowPreViz(false)}
                    onReject={() => setShowPreViz(false)}
                  />
                )}

                {showDeepSign && (
                  <DeepSign onSign={() => setShowDeepSign(false)} />
                )}

              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser.id;
                if (msg.type === 'system_timeline') {
                  return (
                    <div key={idx} style={{ textAlign: 'center', margin: '15px 0' }}>
                      <span style={{ background: '#1E2532', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <i className={`fa-solid ${msg.meta?.icon || 'fa-info-circle'}`} style={{ marginRight: '6px' }}></i>
                        {msg.content}
                      </span>
                    </div>
                  );
                }
                if (msg.type === 'ai_nudge') {
                  return (
                    <div key={idx} style={{ margin: '10px auto', maxWidth: '500px', width: '100%', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, fontSize: '0.85rem', color: '#D1D5DB' }}>
                        <strong style={{ color: '#10b981' }}>AI Nudge:</strong> {msg.content}
                      </div>
                    </div>
                  );
                }
                if (msg.type === 'smart_offer') {
                  return (
                    <div key={idx} style={{ margin: '15px 0', alignSelf: isMe ? 'flex-end' : 'flex-start', width: '350px', background: 'linear-gradient(180deg, #1E2532 0%, #0A0D14 100%)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '15px', color: 'white' }}>{msg.meta?.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '15px', display: 'flex', gap: '10px' }}>
                        <span><i className="fa-solid fa-rotate-left"></i> {msg.meta?.revisions} Revs</span>
                        {msg.meta?.expires_at && <OfferCountdown expiresAt={msg.meta.expires_at} />}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ color: '#D1D5DB' }}>Total Amount</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{msg.meta?.price}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {isMe ? (
                          <>
                            <button onClick={() => addToast('Offer withdrawn', 'fa-trash-can')} style={{ flex: 1, background: 'transparent', color: '#9CA3AF', border: '1px solid #374151', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>Withdraw</button>
                            <button onClick={() => { setOfferPrice(msg.meta?.price || offerPrice); setShowOfferComposer(true); }} style={{ flex: 1, background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>Edit Terms</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setShowOfferComposer(true)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #374151', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>Counter Request</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', background: isMe ? '#6366f1' : '#1E2532', color: 'white', padding: '12px 18px', borderRadius: '16px', maxWidth: '70%', fontSize: '0.95rem' }}>
                    {msg.content}
                  </div>
                );
              })}
            </div>

            {/* Template Picker Overlay */}
            {showTemplates && (
              <div style={{ position: 'absolute', bottom: '150px', left: '30px', right: '30px', background: '#0A0D14', border: '1px solid #6366f1', borderRadius: '16px', padding: '15px', zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#818cf8' }}>Quick Reply Templates</span>
                  <i className="fa-solid fa-xmark" onClick={() => setShowTemplates(false)} style={{ cursor: 'pointer', color: '#6B7280' }}></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {templates.map(t => (
                    <div key={t.title} onClick={() => { setNewMessage(t.text); setShowTemplates(false); }} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer', border: '1px solid transparent' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Composer Overlay */}
            {showOfferComposer && (
              <div style={{ margin: '0 30px', background: '#1E2532', borderRadius: '24px 24px 0 0', padding: '24px', border: '1px solid #6366f1', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0 }}>Smart Offer Composer</h4>
                  <button onClick={() => setShowOfferComposer(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                </div>
                {/* Variant Tabs */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                  {['custom', 'economy', 'recommended', 'express'].map(v => (
                    <button key={v} onClick={() => handleVariantChange(v as any)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: activeVariant === v ? 'rgba(99,102,241,0.2)' : 'transparent', color: activeVariant === v ? '#818cf8' : '#6B7280', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>{v.toUpperCase()}</button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ position: 'relative' }}>
                    <input type="text" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Price" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid #374151', padding: '12px', borderRadius: '8px', color: 'white' }} />
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>Net: ${netEarnings}</div>
                  </div>
                  <input type="text" value={offerTimeline} onChange={e => setOfferTimeline(e.target.value)} placeholder="Timeline" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #374151', padding: '12px', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '15px', fontSize: '0.75rem', color: '#9CA3AF', background: 'rgba(16,185,129,0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <i className="fa-solid fa-calculator" style={{ color: '#10b981', marginRight: '8px' }}></i>
                  GFM Fee: 20%. You will receive <strong>${netEarnings}</strong> upon completion.
                </div>
                <button onClick={handleSendSmartOffer} style={{ width: '100%', background: '#6366f1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Send Offer to Client</button>
              </div>
            )}

            {/* Input Bar */}
            <div style={{ padding: '20px 30px', borderTop: '1px solid #1E2532' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                {generateAIReplies().map(reply => (
                  <button key={reply} onClick={() => sendMessage(undefined, reply)} style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}>{reply}</button>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '15px', background: '#1E2532', padding: '10px 20px', borderRadius: '24px' }}>
                <button type="button" onClick={() => setShowPreViz(true)} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '1.2rem' }} title="Generate AI Pre-Viz Storyboard"><i className="fa-solid fa-wand-magic-sparkles"></i></button>
                <button type="button" onClick={() => setShowOfferComposer(true)} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '1.2rem', cursor: 'pointer' }} title="Smart Offer"><i className="fa-solid fa-file-invoice-dollar"></i></button>
                <button type="button" onClick={() => setShowTemplates(!showTemplates)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.1rem', cursor: 'pointer' }} title="Templates"><i className="fa-solid fa-bolt"></i></button>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} />
                <button type="submit" style={{ background: '#6366f1', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}><i className="fa-solid fa-paper-plane"></i></button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>Select a deal to start.</div>
        )}
      </div>

      {/* RIGHT COLUMN: Deal Intelligence / Business Analytics */}
      {(activeConversation || showAnalytics) && (
        <div className="creator-intelligence" style={{ width: '350px', borderLeft: '1px solid #1E2532', background: '#0A0D14', overflowY: 'auto' }}>
          {/* Header Switcher */}
          <div style={{ padding: '25px 20px 10px', display: 'flex', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <button onClick={() => setShowAnalytics(false)} disabled={!activeConversation} style={{ padding: '8px 0', background: 'none', border: 'none', color: !showAnalytics ? '#818cf8' : '#6B7280', fontSize: '0.8rem', fontWeight: 700, cursor: activeConversation ? 'pointer' : 'not-allowed', borderBottom: !showAnalytics ? '2px solid #818cf8' : '2px solid transparent', transition: 'all 0.2s', opacity: !activeConversation ? 0.5 : 1 }}>DEAL AI</button>
            <button onClick={() => setShowAnalytics(true)} style={{ padding: '8px 0', background: 'none', border: 'none', color: showAnalytics ? '#818cf8' : '#6B7280', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', borderBottom: showAnalytics ? '2px solid #818cf8' : '2px solid transparent', transition: 'all 0.2s' }}>BUSINESS ANALYTICS</button>
          </div>

          {!showAnalytics && activeConversation ? (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-brain" style={{ color: '#818cf8' }}></i> Neural Deal Intelligence
              </h3>

              {/* LIVE MARKET PULSE WIDGET */}
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '16px', padding: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px', marginBottom: '4px' }}>MARKET PULSE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>1240.50 <span style={{ fontSize: '0.7rem', color: '#10b981' }}><i className="fa-solid fa-arrow-up"></i> 1.2%</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>DEMAND</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#818cf8' }}>ULTRA-HIGH</div>
                </div>
              </div>

              {/* GhostPM™ NEGOTIATOR WIDGET */}
              <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '20px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 10px #818cf8' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', letterSpacing: '1px' }}>GHOSTPM™ NEGOTIATOR</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6B7280', marginBottom: '8px' }}>TACTICAL ADVICE</div>
                  <div style={{ fontSize: '0.8rem', color: '#D1D5DB', lineHeight: 1.5 }}>
                    "Client is showing <strong>92% Vision Alignment</strong>. Transition to the 'Smart Offer' now to capitalize on their current excitement."
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid #1E2532' }}>
                    <div style={{ fontSize: '0.6rem', color: '#6B7280', marginBottom: '20px' }}>SAFE ANCHOR</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>$1,100</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid #1E2532' }}>
                    <div style={{ fontSize: '0.6rem', color: '#6B7280', marginBottom: '2px' }}>AMBITIOUS</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#818cf8' }}>$1,450</div>
                  </div>
                </div>
              </div>

              {/* AI Intent Synthesis (Moved slightly down) */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '16px', padding: '16px', marginBottom: '25px' }}>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 900, letterSpacing: '1px', marginBottom: '10px' }}>AI INTENT SYNTHESIS</div>
                <p style={{ fontSize: '0.8rem', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                  "The client is prioritizing <strong>cinematic quality</strong> over speed. They have expressed medium concern about the current revision policy."
                </p>
              </div>

              {/* Sentiment Pulse */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '0 5px' }}>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>SENTIMENT PULSE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></div>
                  PROFESSIONAL / EXCITED
                </div>
              </div>
          
              <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', borderRadius: '16px', padding: '20px', marginBottom: '25px' }}>
            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '5px' }}>Close Probability</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{dealConfidence}%</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>🔥 High Interest from Client</div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '15px' }}>RISK ASSESSMENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
                <span>Active Engagement (High)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
                <span>Budget Alignment (95%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ color: '#f59e0b' }}></i>
                <span>Timeline Tension (Medium)</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '15px' }}>MARKET ALIGNMENT</div>
            {[{label:'Skill Match', val:98, color:'#818cf8'}, {label:'Price Logic', val:85, color:'#10b981'}].map(m => (
              <div key={m.label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}><span>{m.label}</span><span>{m.val}%</span></div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}><div style={{ width: `${m.val}%`, height: '100%', background: m.color, borderRadius: '2px' }}></div></div>
              </div>
            ))}
          </div>
          
              {/* VAULT QUICK-VIEW */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#6B7280', letterSpacing: '1px' }}>VAULT STATUS</div>
                  <Link href="/vault" style={{ fontSize: '0.65rem', color: '#818cf8', textDecoration: 'none', fontWeight: 700 }}>FULL VIEW <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.5rem' }}></i></Link>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>$1,250.00</div>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>Locked in Escrow</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>2 / 4</div>
                    <div style={{ fontSize: '0.65rem', color: '#6B7280' }}>Milestones</div>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowOfferComposer(true)} style={{ width: '100%', background: '#6366f1', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}>Send Smart Offer</button>
            </div>
          ) : (
            <CreatorAnalytics conversations={conversations} />
          )}
        </div>
      )}
    </div>
  );
}
