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
type AITab = 'chat' | 'actions' | 'insights' | 'terminal';

export default function GfmCopilot() {
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AITab>('chat');
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "GFM Co-Pilot (Quantum Upgrade) initialized. All 35+ intelligence layers are active. How can I assist your execution?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- CONTEXT ENGINE ---
  const getContextName = () => {
    if (pathname === '/intelligence') return "Spatial Hub Engine";
    if (pathname === '/') return "Portal Intelligence";
    if (pathname.includes('/explore')) return "Market Arbitrage AI";
    return "Global GFM OS";
  };

  const getInsights = () => [
    { title: "Quantum Active", desc: "System 33 (Progress Nebula) is active for all transfers.", type: "info" },
    { title: "Market Pulse", desc: "Alpha detected: 'Claymation' trend is up 12% in US.", type: "success" },
    { title: "Drift Alert", desc: "System 2 detected 12% variance in latest Bali project.", type: "warning" }
  ];

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText }]);
    
    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [...prev, { id: loadingId, sender: 'ai', text: '', isLoading: true }]);

    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      let aiResponse = `Processing Quantum Command in the context of the ${getContextName()}... All 35+ layers are nominal.`;
      
      if (userText.toLowerCase().includes('drift')) {
        aiResponse = "System 2 (Drift Detector) reports 12% alignment variance. Recommend triggering System 11 (Shadow Draft) to realign aesthetic direction.";
      } else if (userText.toLowerCase().includes('vault') || userText.toLowerCase().includes('files')) {
        aiResponse = "System 31 (Loom) has flagged 2 new frame-notes on the Bali Reel. Open Vault to review.";
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      
      {/* Main Co-Pilot Window (Restored Visual Design) */}
      {isOpen && (
        <div style={{ 
          width: '420px', height: '620px', background: 'rgba(10, 13, 20, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', marginBottom: '20px', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(129,140,248,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          
          {/* Header */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #818cf8, #c084fc)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-bolt-lightning"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem', fontWeight: 800 }}>GFM Co-Pilot</h4>
                  <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-solid fa-microchip"></i> {getContextName()}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%' }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          {/* Nav Tabs (Including New Features) */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 20px', overflowX: 'auto' }}>
            {(['chat', 'actions', 'insights', 'terminal'] as AITab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', padding: '12px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: activeTab === tab ? '#818cf8' : '#6B7280', borderBottom: `2px solid ${activeTab === tab ? '#818cf8' : 'transparent'}` }}>
                {tab}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'chat' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ background: msg.sender === 'user' ? '#818cf8' : 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 16px', fontSize: '0.9rem', borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                      {msg.isLoading ? "..." : msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {activeTab === 'actions' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Trigger Shadow Draft', icon: 'fa-wand-sparkles', system: '11', color: '#818cf8' },
                  { label: 'Calculate Project Drift', icon: 'fa-chart-line', system: '2', color: '#10b981' },
                  { label: 'Optimize Social Cuts', icon: 'fa-scissors', system: '35', color: '#c084fc' }
                ].map((act, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setInput(act.label);
                      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: `System ${act.system} processing: ${act.label} initialized...` }]);
                      setActiveTab('chat');
                    }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ width: '32px', height: '32px', background: `${act.color}22`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color }}>
                      <i className={`fa-solid ${act.icon}`}></i>
                    </div>
                    <div><div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{act.label}</div><div style={{ fontSize: '0.6rem', color: '#6B7280' }}>System {act.system}</div></div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {getInsights().map((insight, idx) => (
                  <div key={idx} style={{ background: 'rgba(129,140,248,0.05)', borderLeft: `4px solid ${insight.type === 'warning' ? '#f59e0b' : '#818cf8'}`, borderRadius: '12px', padding: '16px' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{insight.title}</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>{insight.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'terminal' && (
              <div style={{ padding: '20px', height: '100%' }}>
                <div style={{ background: '#000', padding: '15px', borderRadius: '12px', height: '100%', fontFamily: 'monospace', fontSize: '0.7rem', color: '#10b981', overflowY: 'auto' }}>
                  <div>[SYSTEM] QUANTUM LOGS ACTIVE</div>
                  <div>[INFO] DRIFT MONITORING NOMINAL</div>
                  <div style={{ color: '#818cf8' }}>[EVENT] NEBULA SYNC (42ms)</div>
                  <div style={{ color: '#f59e0b' }}>[WARN] AESTHETIC SHIFT IN Bali Reel</div>
                  <div className="terminal-cursor">_</div>
                </div>
              </div>
            )}
          </div>

          {activeTab === 'chat' && (
            <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '6px 6px 6px 16px' }}>
                <input type="text" placeholder="Command GFM OS..." value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }} />
                <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#818cf8' : '#374151', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle (Restored Signature Button) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #818cf8, #c084fc)', borderRadius: '50%', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(129,140,248,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bolt-lightning'}`}></i>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .terminal-cursor { display: inline-block; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}} />
    </div>
  );
}
