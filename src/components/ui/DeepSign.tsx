"use client";

import React, { useState, useEffect } from 'react';

export default function DeepSign({ onSign }: { onSign: () => void }) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verifying' | 'signed'>('idle');
  const [progress, setProgress] = useState(0);

  const startSigning = () => {
    setStatus('scanning');
    setProgress(0);
  };

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('verifying');
            setTimeout(() => {
              setStatus('signed');
              onSign();
            }, 1000);
            return 100;
          }
          return p + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [status, onSign]);

  return (
    <div className="glass-card premium-border" style={{ padding: '40px', background: 'rgba(10,13,20,0.95)', border: '1px solid rgba(99,102,241,0.5)', textAlign: 'center', maxWidth: '400px', margin: '20px auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(99,102,241,0.2)' }}>
          {status === 'idle' && <i className="fa-solid fa-fingerprint fa-2x" style={{ color: '#818cf8' }}></i>}
          {status === 'scanning' && <i className="fa-solid fa-expand fa-2x" style={{ color: '#818cf8', animation: 'pulse 1s infinite' }}></i>}
          {status === 'verifying' && <i className="fa-solid fa-shield-halved fa-2x" style={{ color: '#f59e0b', animation: 'spin 2s linear infinite' }}></i>}
          {status === 'signed' && <i className="fa-solid fa-circle-check fa-2x" style={{ color: '#10b981' }}></i>}
          
          {status === 'scanning' && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid #818cf8', borderRadius: '50%', clipPath: `inset(${100 - progress}% 0 0 0)` }}></div>
          )}
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          {status === 'idle' && 'Deep-Sign Cryptographic Lock'}
          {status === 'scanning' && 'Scanning Security Tokens...'}
          {status === 'verifying' && 'Verifying Multi-Sig Authority...'}
          {status === 'signed' && 'Contract Locked Successfully'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
          This contract will be cryptographically bound to your device hardware and the GFM Vault.
        </p>
      </div>

      {status === 'idle' && (
        <button onClick={startSigning} className="btn btn-primary animate-shimmer" style={{ width: '100%', padding: '15px' }}>
          Initialize Deep-Sign
        </button>
      )}

      {(status === 'scanning' || status === 'verifying') && (
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1', transition: 'width 0.1s' }}></div>
        </div>
      )}

      {status === 'signed' && (
        <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
          <i className="fa-solid fa-lock" style={{ marginRight: '8px' }}></i> DEPLOYED TO GFM PROTOCOL
        </div>
      )}
    </div>
  );
}
