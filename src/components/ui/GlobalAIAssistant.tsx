"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isLoading?: boolean;
};

type AIMode = 'manager' | 'creative' | 'business';
type AITab = 'chat' | 'actions' | 'insights';

export default function GlobalAIAssistant() {
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AITab>('chat');
  const [activeMode, setActiveMode] = useState<AIMode>('manager');
  const [input, setInput] = useState('');
  const [idleSuggestion, setIdleSuggestion] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "GFM Co-Pilot initialized. How can I accelerate your workflow today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Context Engine ---
  let contextName = 'Global';
  let availableActions = [
    { label: 'Generate Brief', icon: 'fa-file-lines', action: 'draft-brief' },
    { label: 'Find Creators', icon: 'fa-magnifying-glass', action: 'find-creators' }
  ];
  let currentInsights = [
    { title: "Platform Update", desc: "Escrow release times are 20% faster this week.", type: "info" }
  ];

  if (pathname.includes('/dashboard')) {
    contextName = 'Dashboard Control';
    availableActions = [
      { label: 'Summarize Projects', icon: 'fa-list-check', action: 'summarize' },
      { label: 'Predict Earnings', icon: 'fa-chart-line', action: 'predict' }
    ];
    currentInsights = [
      { title: "Revenue Forecast", desc: "Based on pipeline, you will hit $2,400 this month.", type: "success" },
      { title: "Action Required", desc: "1 pending review is blocking escrow release.", type: "warning" }
    ];
  } else if (pathname.includes('/workspace')) {
    contextName = 'Workspace Engine';
    availableActions = [
      { label: 'Analyze Latest File', icon: 'fa-photo-film', action: 'analyze' },
      { label: 'Draft Auto-Reply', icon: 'fa-reply', action: 'reply' },
      { label: 'Flag Deadline Risk', icon: 'fa-flag', action: 'flag' }
    ];
    currentInsights = [
      { title: "Client Sentiment", desc: "Client is highly engaged. Suggest an upsell.", type: "success" },
      { title: "Workflow Risk", desc: "No files uploaded in 48 hours.", type: "danger" }
    ];
  } else if (pathname.includes('/gig') || pathname.includes('/explore')) {
    contextName = 'Marketplace AI';
    availableActions = [
      { label: 'Optimize Gig SEO', icon: 'fa-wand-magic-sparkles', action: 'seo' },
      { label: 'Suggest Pricing', icon: 'fa-tag', action: 'pricing' }
    ];
    currentInsights = [
      { title: "Market Demand", desc: "Video editing gigs are up 15% this week.", type: "info" }
    ];
  }

  // Proactive Idle Mode Logic
  useEffect(() => {
    if (!isOpen) {
      // Simulate proactive AI finding something after 5 seconds on a new page
      const timer = setTimeout(() => {
        if (pathname.includes('/workspace')) setIdleSuggestion("Client is online. Send an update?");
        else if (pathname.includes('/dashboard')) setIdleSuggestion("1 project needs your review.");
        else setIdleSuggestion(null);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIdleSuggestion(null);
    }
  }, [pathname, isOpen]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSubmit = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = customText || input.trim();
    if (!userText) return;

    setInput('');
    setActiveTab('chat');

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [...prev, { id: loadingId, sender: 'ai', text: '', isLoading: true }]);

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      let aiResponse = `I'm analyzing your request in ${activeMode} mode.`;
      
      // Mock Action Responses
      if (userText === '[ACTION: analyze]') aiResponse = "Analyzing latest video file... Found 2 pacing issues at 00:15 and 00:32. Color grade is consistent.";
      else if (userText === '[ACTION: reply]') aiResponse = "Here is a draft: 'Hi! I've received your feedback and will implement the revisions by tomorrow morning.'";
      else if (userText === '[ACTION: summarize]') aiResponse = "You have 3 active projects. 2 are on track, 1 is delayed pending client assets.";
      else if (userText === '[ACTION: seo]') aiResponse = "To improve this gig, add keywords: 'Cinematic', 'Premiere Pro', '4K'.";
      else aiResponse = `Understood. In the context of ${contextName}, I recommend proceeding carefully. Is there a specific file or metric you want me to analyze?`;

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
    }, 1200);
  };

  const handleActionClick = (actionCode: string) => {
    handleSubmit(undefined, `[ACTION: ${actionCode}]`);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* Idle Proactive Suggestion Bubble */}
      {!isOpen && idleSuggestion && (
        <div style={{
          background: 'rgba(99,102,241,0.95)', backdropFilter: 'blur(10px)', color: 'white',
          padding: '12px 20px', borderRadius: '20px', marginBottom: '15px', fontSize: '0.9rem',
          boxShadow: '0 10px 25px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'fadeInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)'
        }} onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-bell" style={{ animation: 'ring 2s infinite' }}></i>
          {idleSuggestion}
          <button onClick={(e) => { e.stopPropagation(); setIdleSuggestion(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginLeft: '10px' }}><i className="fa-solid fa-times"></i></button>
        </div>
      )}

      {/* Main Co-Pilot Window */}
      {isOpen && (
        <div style={{ 
          width: '420px', 
          height: '600px', 
          background: 'rgba(10, 13, 20, 0.85)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '24px', 
          marginBottom: '20px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.15)',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          
          {/* Header & Modes */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(99,102,241,0.4)' }}>
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.5px' }}>GFM Co-Pilot</h4>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-solid fa-location-crosshairs"></i> {contextName}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            {/* Persona Switcher */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '4px' }}>
              {(['manager', 'creative', 'business'] as AIMode[]).map(mode => (
                <button 
                  key={mode} 
                  onClick={() => setActiveMode(mode)}
                  style={{ 
                    flex: 1, padding: '6px 0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
                    background: activeMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeMode === mode ? 'white' : '#6B7280',
                    boxShadow: activeMode === mode ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'
                  }}>
                  {mode === 'manager' && <i className="fa-solid fa-briefcase" style={{ marginRight: '4px' }}></i>}
                  {mode === 'creative' && <i className="fa-solid fa-palette" style={{ marginRight: '4px' }}></i>}
                  {mode === 'business' && <i className="fa-solid fa-chart-pie" style={{ marginRight: '4px' }}></i>}
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Nav Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 20px' }}>
            {(['chat', 'actions', 'insights'] as AITab[]).map(tab => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s',
                  color: activeTab === tab ? '#818cf8' : '#6B7280',
                  borderBottom: `2px solid ${activeTab === tab ? '#818cf8' : 'transparent'}`
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
            
            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    {msg.sender === 'ai' && (
                      <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', flexShrink: 0 }}>
                        <i className="fa-solid fa-bolt"></i>
                      </div>
                    )}
                    <div style={{ 
                      background: msg.sender === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)', 
                      color: 'white', padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.5,
                      borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                    }}>
                      {msg.isLoading ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
                          <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                          <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></div>
                          <div style={{ width: '6px', height: '6px', background: '#a855f7', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></div>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* ACTIONS TAB */}
            {activeTab === 'actions' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.3s' }}>
                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: '0 0 10px 0' }}>Contextual actions for <strong>{contextName}</strong></p>
                {availableActions.map(act => (
                  <button 
                    key={act.action} onClick={() => handleActionClick(act.action)}
                    style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    <div style={{ width: '36px', height: '36px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.1rem' }}>
                      <i className={`fa-solid ${act.icon}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{act.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Execute instantly via Co-Pilot</div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#4B5563', fontSize: '0.8rem' }}></i>
                  </button>
                ))}
              </div>
            )}

            {/* INSIGHTS TAB */}
            {activeTab === 'insights' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem' }}>Real-Time Analysis</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div> Scanning active
                  </div>
                </div>

                {currentInsights.map((insight, idx) => {
                  let colorStr = '#3b82f6';
                  let bgStr = 'rgba(59,130,246,0.1)';
                  let iconStr = 'fa-info-circle';
                  if (insight.type === 'success') { colorStr = '#10b981'; bgStr = 'rgba(16,185,129,0.1)'; iconStr = 'fa-check-circle'; }
                  if (insight.type === 'warning') { colorStr = '#f59e0b'; bgStr = 'rgba(245,158,11,0.1)'; iconStr = 'fa-exclamation-triangle'; }
                  if (insight.type === 'danger') { colorStr = '#ef4444'; bgStr = 'rgba(239,68,68,0.1)'; iconStr = 'fa-shield-halved'; }

                  return (
                    <div key={idx} style={{ background: bgStr, border: `1px solid rgba(255,255,255,0.05)`, borderLeft: `4px solid ${colorStr}`, borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
                      <i className={`fa-solid ${iconStr}`} style={{ color: colorStr, fontSize: '1.2rem', marginTop: '2px' }}></i>
                      <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{insight.title}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.85rem', lineHeight: 1.4 }}>{insight.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Input Area (Only visible in Chat mode) */}
          {activeTab === 'chat' && (
            <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
              <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '6px 6px 6px 16px', transition: 'all 0.2s' }}>
                <input 
                  type="text" 
                  placeholder="Ask Co-Pilot..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.95rem' }}
                />
                <button type="button" style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1rem' }}><i className="fa-solid fa-microphone"></i></button>
                <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#6366f1' : '#374151', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', boxShadow: input.trim() ? '0 0 10px rgba(99,102,241,0.5)' : 'none' }}>
                  <i className="fa-solid fa-arrow-up" style={{ fontSize: '1rem' }}></i>
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* Floating Co-Pilot Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '64px', 
          height: '64px', 
          background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
          borderRadius: '50%', 
          border: 'none', 
          color: 'white', 
          fontSize: '1.8rem', 
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(99,102,241,0.4), inset 0 0 10px rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(99,102,241,0.6), inset 0 0 10px rgba(255,255,255,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.4), inset 0 0 10px rgba(255,255,255,0.3)'; }}
      >
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bolt'}`} style={{ transition: 'all 0.3s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}></i>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(5deg); }
          40% { transform: rotate(-5deg); }
          50% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}} />
    </div>
  );
}
