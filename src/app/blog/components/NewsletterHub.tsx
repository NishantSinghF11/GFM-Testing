"use client";

import React, { useState } from 'react';

export default function NewsletterHub() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section style={{ 
      background: 'linear-gradient(135deg, rgba(10, 13, 20, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%)', 
      border: '1px solid #4B5563', 
      borderRadius: '40px', 
      padding: '80px', 
      textAlign: 'center', 
      position: 'relative', 
      overflow: 'hidden',
      marginTop: '100px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
    }}>
      {/* Decorative Neural Glow */}
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '400px', height: '400px', background: 'rgba(99,102,241,0.08)', borderRadius: '50%', filter: 'blur(100px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'rgba(52,211,153,0.05)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
        <i className="fa-solid fa-paper-plane fa-3x" style={{ color: '#6366f1', marginBottom: '30px', opacity: 0.8 }}></i>
        <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>Join the <span className="text-gradient">Circle</span></h2>
        <p style={{ color: '#9CA3AF', fontSize: '1.2rem', marginBottom: '45px', lineHeight: 1.6 }}>
          Receive weekly strategic digests on the creative economy, AI collaboration, and high-authority production tactics.
        </p>

        {status === 'success' ? (
          <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid #34d399', borderRadius: '24px', padding: '30px', animation: 'fadeIn 0.5s ease' }}>
            <i className="fa-solid fa-circle-check fa-2x" style={{ color: '#34d399', marginBottom: '15px' }}></i>
            <h4 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>You're in the Loop!</h4>
            <p style={{ color: '#A7F3D0', margin: '5px 0 0' }}>Welcome to the elite GFM intelligence network.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '28px', border: '1px solid #374151' }}>
            <input 
              type="email" 
              placeholder="Enter your professional email..." 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '0 25px', color: 'white', fontSize: '1.1rem', outline: 'none' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary animate-shimmer" 
              disabled={status === 'loading'}
              style={{ padding: '15px 40px', borderRadius: '20px', fontSize: '1rem', fontWeight: 700 }}
            >
              {status === 'loading' ? 'Encrypting...' : 'Subscribe Now'}
            </button>
          </form>
        )}
        <p style={{ color: '#4B5563', fontSize: '0.8rem', marginTop: '20px' }}>
          Zero spam. Only high-authority insights. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
