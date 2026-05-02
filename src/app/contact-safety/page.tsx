"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactSafetyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', padding: '60px 40px', borderRadius: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 30px' }}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Message Sent</h2>
          <div style={{ background: 'rgba(129,140,248,0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(129,140,248,0.1)', marginBottom: '25px' }}>
            <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '5px' }}>Inquiry Reference</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'white', letterSpacing: '1px' }}>GFM-SAFE-{Math.random().toString(36).substring(7).toUpperCase()}</div>
          </div>
          <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginBottom: '30px' }}>
            Your message has been routed to an **Escrow & Security Specialist**. A member of our team will reach out to you via your registered email shortly.
          </p>
          <Link href="/privacy-safety" className="btn btn-primary" style={{ padding: '12px 30px' }}>Back to Safety Center</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px' }}>
      <div style={{ position: 'absolute', top: '0', right: '0', width: '100%', height: '400px', background: 'linear-gradient(180deg, rgba(16,185,129,0.05) 0%, transparent 100%)', pointerEvents: 'none' }}></div>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        
        <header style={{ marginBottom: '60px' }}>
          <Link href="/privacy-safety" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Safety Center
          </Link>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '15px' }}>Contact the <span className="text-gradient">Safety Team</span></h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Speak directly with a GFM safety specialist. We're available 24/7 for urgent assistance.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
          
          {/* CONTACT OPTIONS */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '24px' }}>
              <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.7rem', marginBottom: '15px', letterSpacing: '1px' }}>URGENT HELP</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <i className="fa-solid fa-headset fa-2x" style={{ color: '#10b981' }}></i>
                <div>
                  <div style={{ fontWeight: 700 }}>24/7 Live Chat</div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981' }}>Current wait: 2 mins</div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: '#10b981', color: '#10b981' }}>Start Live Chat</button>
            </div>

            <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '24px' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px' }}>Direct Email</div>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '10px' }}>For non-urgent safety inquiries or follow-ups.</p>
              <div style={{ color: '#818cf8', fontWeight: 700 }}>safety@gigsforme.com</div>
            </div>
          </aside>

          {/* CONTACT FORM */}
          <section className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', marginBottom: '8px' }}>SUBJECT</label>
                <input 
                  type="text" 
                  placeholder="e.g., Urgent account security question"
                  required
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #374151', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', marginBottom: '8px' }}>MESSAGE</label>
                <textarea 
                  placeholder="Describe your concern or question..."
                  required
                  style={{ width: '100%', minHeight: '180px', background: 'rgba(0,0,0,0.3)', border: '1px solid #374151', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', fontWeight: 800 }}>Send Secure Message</button>
            </form>
          </section>

        </div>

      </div>
    </main>
  );
}
