"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reportType, setReportType] = useState('scam');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', padding: '60px 40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 30px' }}>
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Report Received</h2>
          <div style={{ background: 'rgba(16,185,129,0.05)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.1)', marginBottom: '25px' }}>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', marginBottom: '5px' }}>Reference ID</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'white', letterSpacing: '1px' }}>GFM-REP-{Math.random().toString(36).substring(7).toUpperCase()}</div>
          </div>
          <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginBottom: '30px' }}>
            Thank you for helping keep GigsForMe safe. Our Trust & Safety team has been notified and will review your report within 24 hours. You will receive an update via email.
          </p>
          <Link href="/privacy-safety" className="btn btn-primary" style={{ padding: '12px 30px' }}>Return to Safety Center</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px' }}>
      <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '400px', background: 'linear-gradient(180deg, rgba(99,102,241,0.05) 0%, transparent 100%)', pointerEvents: 'none' }}></div>

      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        
        <header style={{ marginBottom: '60px' }}>
          <Link href="/privacy-safety" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Safety Center
          </Link>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '15px' }}>Report a <span className="text-gradient">Concern</span></h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Tell us what's happening. We're here to help and protect the GFM community.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          
          {/* REPORT FORM */}
          <section className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>What are you reporting?</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid #374151', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none' }}
                >
                  <option value="scam">Scam or Fraudulent Activity</option>
                  <option value="harassment">Harassment or Abuse</option>
                  <option value="payment">Payment or Escrow Dispute</option>
                  <option value="content">Inappropriate Content</option>
                  <option value="copyright">Copyright Infringement</option>
                  <option value="other">Other Concern</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Details</label>
                <textarea 
                  placeholder="Please describe the issue in detail. Include order IDs, user names, or specific messages if applicable."
                  required
                  style={{ width: '100%', minHeight: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid #374151', borderRadius: '12px', padding: '15px', color: 'white', outline: 'none', resize: 'vertical' }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Evidence (Optional)</label>
                <div style={{ border: '2px dashed #374151', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#818cf8'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}>
                  <i className="fa-solid fa-cloud-arrow-up fa-2x" style={{ color: '#4B5563', marginBottom: '10px' }}></i>
                  <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>Drag & drop screenshots or files here</div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1rem', fontWeight: 700 }}>Submit Official Report</button>
              
              <p style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', margin: 0 }}>
                By submitting this report, you acknowledge that providing false information may result in account action.
              </p>
            </form>
          </section>

          {/* SIDEBAR INFO */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ padding: '30px', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#818cf8' }}>Contact Safety Team</h3>
              <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '20px' }}>
                Need to speak with a specialist directly? Our team is available 24/7 for urgent safety concerns.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-envelope" style={{ color: '#6366f1' }}></i>
                  <span>safety@gigsforme.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-bolt" style={{ color: '#f59e0b' }}></i>
                  <span>Live Chat (Members Only)</span>
                </div>
              </div>
              <Link href="/contact-safety" className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '10px' }}>Contact Specialist</Link>
            </div>

            <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Why Report?</h3>
              <ul style={{ color: '#9CA3AF', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', gap: '8px' }}><i className="fa-solid fa-shield" style={{ color: '#10b981' }}></i> Protect yourself and others from fraud</li>
                <li style={{ display: 'flex', gap: '8px' }}><i className="fa-solid fa-shield" style={{ color: '#10b981' }}></i> Maintain high quality standards</li>
                <li style={{ display: 'flex', gap: '8px' }}><i className="fa-solid fa-shield" style={{ color: '#10b981' }}></i> Ensure fair treatment for all members</li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#4B5563', marginBottom: '5px' }}>Average Response Time</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>&lt; 4 Hours</div>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
