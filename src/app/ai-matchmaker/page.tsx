"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AIMatchmakerPage() {
  const router = useRouter();
  const [matchPrompt, setMatchPrompt] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const handleAIMatch = () => {
    if (!matchPrompt.trim()) return;
    setIsMatching(true);
    
    // Simulate AI scanning delay, then route to explore page with the query
    setTimeout(() => {
      setIsMatching(false);
      // In a real app, you would pass the prompt to the backend AI and redirect to a results page.
      // For now, we redirect to explore and just show the "AI Matched" state.
      // We can pass a URL parameter to tell explore page to show the matched state.
      router.push(`/explore?matched=true&query=${encodeURIComponent(matchPrompt)}`);
    }, 2000);
  };

  return (
    <div style={{ background: '#05070B', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        width: '100%',
        padding: '80px 20px', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.5 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '20px' }}>
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI MATCHMAKER
          </div>
          <h1 style={{ fontSize: '4rem', margin: '0 0 15px 0', fontFamily: 'var(--font-heading)', lineHeight: 1.1, color: 'white' }}>
            Describe your project.<br/>We'll find the <span style={{ color: 'var(--color-primary-light)' }}>perfect creator.</span>
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.2rem', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
            Skip the endless scrolling. Tell our AI exactly what you need built, your timeline, and your style preferences.
          </p>

          {/* AI Search Bar */}
          {!isMatching ? (
            <div style={{ 
              background: 'rgba(17,24,39,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #374151',
              borderRadius: '24px', padding: '10px 10px 10px 24px', display: 'flex', alignItems: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              transition: 'all 0.3s ease',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              <i className="fa-solid fa-robot" style={{ color: '#818cf8', fontSize: '1.5rem', marginRight: '15px' }}></i>
              <input 
                type="text" 
                placeholder="e.g. I need a 30s cinematic TikTok ad for my clothing brand by this Friday..." 
                value={matchPrompt}
                onChange={(e) => setMatchPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIMatch()}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', outline: 'none' }}
              />
              <button 
                onClick={handleAIMatch}
                disabled={!matchPrompt.trim()}
                className="btn btn-primary" 
                style={{ borderRadius: '16px', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}
              >
                Match Me
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '30px' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', background: '#818cf8',
                    animation: `neuralPulse 0.8s infinite ${i * 0.2}s`,
                    boxShadow: '0 0 15px #818cf8'
                  }}></div>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Scanning Global Talent Graph...
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', marginTop: '10px' }}>
                Analyzing {matchPrompt.length * 42} data points across {matchPrompt.split(' ').length} intent clusters.
              </div>
              
              {/* Internal Animation CSS */}
              <style>{`
                @keyframes neuralPulse {
                  0%, 100% { transform: scale(1); opacity: 0.3; }
                  50% { transform: scale(1.5); opacity: 1; filter: blur(2px); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
