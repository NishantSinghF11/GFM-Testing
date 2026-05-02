"use client";

import React, { useState, useMemo } from 'react';
import { DashboardProps } from './types';
import OfferCountdown from '@/components/ui/OfferCountdown';
import NotificationCenter from '@/components/ui/NotificationCenter';

export default function ClientDashboard({
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
  const [showVaultDetails, setShowVaultDetails] = useState(false);
  
  // --- AI INTELLIGENCE SIMULATION ---
  const aiInsights = useMemo(() => {
    const priceNum = parseFloat(offerPrice.replace(/[^0-9.]/g, '')) || 0;
    const isGoodPrice = priceNum < 600;
    const isFast = offerTimeline.includes('24') || offerTimeline.includes('1');
    
    let score = 70;
    if (isGoodPrice) score += 15;
    if (isFast) score += 10;
    if (activeConversation?.emotion === 'positive') score += 5;

    return {
      score,
      pros: [
        isGoodPrice ? "Cost-effective (15% below market)" : "Premium Service Level",
        isFast ? "Exceptional Delivery Speed" : "Realistic Production Cycle",
        "High Creator Reliability (99%)"
      ],
      cons: [
        priceNum > 800 ? "Higher than average investment" : null,
        activeConversation?.emotion === 'frustrated' ? "Communication friction detected" : null,
      ].filter(Boolean),
      nudge: isGoodPrice ? "This is a high-value offer. Secure it before the creator's schedule fills up." : "Consider asking for 1 additional revision to maximize value."
    };
  }, [offerPrice, offerTimeline, activeConversation]);

  return (
    <div style={{ background: '#05070B', height: 'calc(100vh - 70px)', display: 'flex', overflow: 'hidden', color: 'white', position: 'relative' }}>
      
      {/* MOBILE NAV BAR (Only visible on small screens) */}
      <div className="mobile-nav-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', background: 'rgba(10, 13, 20, 0.95)', backdropFilter: 'blur(15px)', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 1000, display: 'none', padding: '0 20px', alignItems: 'center', justifyContent: 'space-around' }}>
        <button onClick={() => setMobileView('list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'list' ? '#10b981' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-list-check" style={{ fontSize: '1.2rem' }}></i> Tracker
        </button>
        <button onClick={() => setMobileView('chat')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'chat' ? '#10b981' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-comments" style={{ fontSize: '1.2rem' }}></i> Chat
        </button>
        <button onClick={() => setMobileView('intelligence')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: mobileView === 'intelligence' ? '#10b981' : '#6B7280', fontSize: '0.75rem', fontWeight: 700 }}>
          <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.2rem' }}></i> AI Audit
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .mobile-nav-bar { display: flex !important; }
          .client-sidebar { display: ${mobileView === 'list' ? 'flex' : 'none'} !important; width: 100% !important; }
          .client-main { display: ${mobileView === 'chat' ? 'flex' : 'none'} !important; }
          .client-intelligence { display: ${mobileView === 'intelligence' ? 'flex' : 'none'} !important; width: 100% !important; position: fixed; inset: 0; z-index: 50; }
        }
        @keyframes ai-pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

      {/* LEFT COLUMN: Project Tracker Sidebar */}
      <div className="client-sidebar" style={{ width: '320px', borderRight: '1px solid #1E2532', background: '#0D0A14', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1E2532' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 15px 0', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Project Tracker <i className="fa-solid fa-list-check" style={{ fontSize: '0.9rem', color: '#6B7280', cursor: 'pointer' }}></i>
          </h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1E2532', borderRadius: '12px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-search" style={{ color: '#6B7280' }}></i>
            <input type="text" placeholder="Search creators..." style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '0.9rem' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(conv => (
            <div key={conv.user_id} onClick={() => setActiveConversation(conv)} style={{ padding: '20px', borderBottom: '1px solid #1E2532', cursor: 'pointer', transition: 'all 0.2s', background: activeConversation?.user_id === conv.user_id ? 'rgba(99,102,241,0.05)' : 'transparent', borderLeft: activeConversation?.user_id === conv.user_id ? '3px solid #10b981' : '3px solid transparent' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: `linear-gradient(135deg, ${conv.cover_color}, #1E2532)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                    {conv.initials}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{conv.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{conv.last_time}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.last_message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER COLUMN: Negotiation Stage */}
      <div className="client-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#05070B', position: 'relative' }}>
        {activeConversation ? (
          <>
            {/* Header & Stats */}
            <div style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,13,20,0.95)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {activeConversation.name}
                  <span style={{ fontSize: '0.7rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '4px 8px', borderRadius: '12px', fontWeight: 700 }}>PRO CREATOR ⚡</span>
                </h3>
                <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gig Status</div>
                    <div style={{ fontWeight: 700, color: '#f59e0b' }}>In Discussion</div>
                  </div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget Cap</div>
                    <div style={{ fontWeight: 700, color: 'white' }}>$2,000</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <NotificationCenter />
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                <button onClick={() => setShowVault(true)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-vault"></i> VAULT
                </button>
              </div>
            </div>

            {/* Pipeline Stage Visualization */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
              {['inquiry', 'negotiation', 'offer', 'accepted'].map((stage, idx) => {
                const isActive = pipelineStage === stage;
                const isPast = ['inquiry', 'negotiation', 'offer', 'accepted'].indexOf(pipelineStage) > idx;
                return (
                  <div key={stage} style={{ flex: 1, position: 'relative' }}>
                    <div style={{ height: '4px', background: isPast || isActive ? '#10b981' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.5s' }}></div>
                    <div style={{ marginTop: '8px', fontSize: '0.65rem', fontWeight: 700, color: isActive ? 'white' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{stage}</span>
                      {isPast && <i className="fa-solid fa-check" style={{ color: '#10b981' }}></i>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser.id;
                if (msg.type === 'smart_offer') {
                  return (
                    <div key={idx} style={{ margin: '15px 0', alignSelf: isMe ? 'flex-end' : 'flex-start', width: '350px', background: 'linear-gradient(180deg, #1E2532 0%, #0A0D14 100%)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.4)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Smart Offer Received</span>
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '10px', color: 'white' }}>{msg.meta?.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ color: '#D1D5DB' }}>Total Amount</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{msg.meta?.price}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {!isMe && (
                          <>
                            <button onClick={() => setShowOfferComposer(true)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid #374151', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Counter Offer</button>
                            <button onClick={() => { if (!msg.meta) return; setSelectedOfferForCheckout(msg.meta); setShowCheckoutPreview(true); }} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Accept & Fund</button>
                          </>
                        )}
                      </div>
                      <div onClick={() => setShowVaultDetails(!showVaultDetails)} style={{ marginTop: '15px', background: 'rgba(16,185,129,0.05)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: '#D1D5DB', cursor: 'pointer', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <i className="fa-solid fa-shield-halved" style={{ color: '#10b981', marginRight: '8px' }}></i> 
                        Secured by <strong>GFM Vault</strong>. (View Details)
                      </div>
                      {showVaultDetails && (
                        <div style={{ marginTop: '10px', fontSize: '0.7rem', color: '#9CA3AF', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', lineHeight: 1.5 }}>
                          • Funds held in neutral escrow<br/>
                          • Only released when you approve work<br/>
                          • Full dispute resolution included
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', background: isMe ? '#10b981' : '#1E2532', color: 'white', padding: '12px 18px', borderRadius: '16px', maxWidth: '70%', fontSize: '0.95rem' }}>
                    {msg.content}
                  </div>
                );
              })}
            </div>

            {/* Custom Request Composer */}
            {showOfferComposer && (
              <div style={{ margin: '0 30px', background: '#1E2532', borderRadius: '24px 24px 0 0', padding: '24px', border: '1px solid #10b981', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0 }}>Custom Request Maker</h4>
                  <button onClick={() => setShowOfferComposer(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <input type="text" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="Propose Price" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #374151', padding: '12px', borderRadius: '8px', color: 'white' }} />
                  <input type="text" value={offerTimeline} onChange={e => setOfferTimeline(e.target.value)} placeholder="Propose Timeline" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #374151', padding: '12px', borderRadius: '8px', color: 'white' }} />
                </div>
                <button onClick={handleSendSmartOffer} style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Send Request to Creator</button>
              </div>
            )}

            {/* Input Bar */}
            <div style={{ padding: '20px 30px', borderTop: '1px solid #1E2532' }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '15px', background: '#1E2532', padding: '10px 20px', borderRadius: '24px' }}>
                <button type="button" onClick={() => setShowOfferComposer(true)} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fa-solid fa-hand-holding-dollar"></i></button>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }} />
                <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}><i className="fa-solid fa-paper-plane"></i></button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>Select a creator to start.</div>
        )}
      </div>

      {/* RIGHT COLUMN: AI Deal Intelligence */}
      {activeConversation && (
        <div className="client-intelligence" style={{ width: '350px', borderLeft: '1px solid #1E2532', background: '#0A0D14', padding: '30px 20px', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', animation: 'ai-pulse 2s infinite' }}></div>
            <h3 style={{ fontSize: '0.9rem', color: '#818cf8', textTransform: 'uppercase', margin: 0, fontWeight: 700, letterSpacing: '1px' }}>
              AI Deal Intelligence
            </h3>
          </div>

          {/* AI Decision Score Gauge */}
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '25px', marginBottom: '25px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset={339.29 * (1 - aiInsights.score / 100)} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{aiInsights.score}%</div>
                  <div style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>Decision Score</div>
                </div>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                <i className="fa-solid fa-arrow-trend-up"></i> Highly Recommended
              </div>
            </div>
          </div>

          {/* AI Pros & Cons */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '0.5px' }}>Smart Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiInsights.pros.map((pro, idx) => (
                <div key={idx} style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <i className="fa-solid fa-plus-circle" style={{ color: '#10b981' }}></i>
                  <span style={{ color: '#D1D5DB' }}>{pro}</span>
                </div>
              ))}
              {aiInsights.cons.map((con, idx) => (
                <div key={idx} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <i className="fa-solid fa-minus-circle" style={{ color: '#ef4444' }}></i>
                  <span style={{ color: '#D1D5DB' }}>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Negotiation Nudge */}
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '20px', marginBottom: '25px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> AI Suggestion
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#E5E7EB', lineHeight: 1.5 }}>
              {aiInsights.nudge}
            </p>
            <button onClick={() => setNewMessage(aiInsights.nudge)} style={{ marginTop: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Use this suggestion</button>
          </div>

          {/* AI Risk Shield */}
          <div style={{ borderTop: '1px solid #1E2532', paddingTop: '20px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-shield-virus" style={{ fontSize: '1.2rem', color: '#10b981' }}></i>
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Risk Shield</div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981' }}>Monitoring active • Secure</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6B7280', textAlign: 'right' }}>
                GFM Protocol<br/>Level 4
              </div>
            </div>
          </div>
          
          <button onClick={() => addToast('Deep-scanning portfolio...', 'fa-magnifying-glass-chart')} style={{ width: '100%', background: '#6366f1', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(99,102,241,0.2)', transition: 'all 0.2s' }}>View Full AI Audit</button>
        </div>
      )}
    </div>
  );
}
