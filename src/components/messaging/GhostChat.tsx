"use client";

import React, { useState } from 'react';

export default function GhostChat() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', text: "Hello! I am Ghost, your Active Building agent. I've analyzed your Bali Reel project and I'm ready to build solutions.", actions: ['Draft Alternate Hook', 'Optimize Color Mood'] }
  ]);

  const runAction = (action: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', text: `Run: ${action}`, actions: [] },
      { id: (Date.now()+1).toString(), role: 'ai', text: `Building "${action}"... I've generated a Shadow Draft in your project viewer. Check it now!`, actions: [] }
    ]);
  };

  return (
    <div className="glass-card premium-border" style={{ height: '600px', display: 'flex', flexDirection: 'column', background: 'rgba(10,13,20,0.98)', overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-ghost" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', border: '2px solid #000' }}></div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>GHOST CHAT</div>
          <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800 }}>ACTIVE BUILDING MODE</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: '16px', 
              fontSize: '0.85rem',
              background: m.role === 'user' ? '#818cf8' : 'rgba(255,255,255,0.05)',
              color: m.role === 'user' ? 'white' : '#D1D5DB',
              border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}>
              {m.text}
            </div>
            
            {m.actions.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {m.actions.map(a => (
                  <button 
                    key={a}
                    onClick={() => runAction(a)}
                    style={{ fontSize: '0.7rem', padding: '6px 12px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '8px', color: '#818cf8', cursor: 'pointer' }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Command Ghost to build..." 
            style={{ flex: 1, padding: '12px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', color: 'white', fontSize: '0.85rem' }}
          />
          <button style={{ width: '45px', height: '45px', background: '#818cf8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
