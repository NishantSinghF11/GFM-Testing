"use client";

import React from 'react';
import Link from 'next/link';

export default function HelpClient() {
  const categories = [
    { title: 'Payments & Escrow', icon: 'fa-vault', links: ['How GFM Vault works', 'Milestone payments', 'Refund policy', 'Payout schedules'] },
    { title: 'Account & Security', icon: 'fa-user-shield', links: ['Securing your account', 'Two-factor authentication', 'Changing your email', 'Privacy settings'] },
    { title: 'Hiring & Gigs', icon: 'fa-briefcase', links: ['Posting a high-quality gig', 'Reviewing portfolios', 'Smart Offer guide', 'Managing active deals'] },
    { title: 'Trust & Safety', icon: 'fa-shield-halved', links: ['Spotting common scams', 'Reporting a user', 'GFM Protocol details', 'Dispute resolution'] }
  ];

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', paddingBottom: '80px' }}>
      
      {/* HERO SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '80px', paddingTop: '60px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>How can we <span className="text-gradient">help?</span></h1>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <i className="fa-solid fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }}></i>
            <input 
              type="text" 
              placeholder="Search help articles..." 
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '16px', padding: '18px 18px 18px 50px', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* HELP CATEGORIES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {categories.map(cat => (
            <div key={cat.title} className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.2rem', marginBottom: '20px' }}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{cat.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cat.links.map(link => (
                  <li key={link}><Link href="#" style={{ color: '#9CA3AF', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}>{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* REPORT SECTION */}
        <section style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '40px', padding: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(99,102,241,0.05)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', position: 'relative', zIndex: 1 }}>Notice something? <span className="text-gradient">Report it.</span></h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            Our dedicated Trust & Safety team reviews all reports within 24 hours. Help us maintain the integrity of the GFM community.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <Link href="/report" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1rem' }}>Report a Concern</Link>
            <Link href="/contact-safety" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1rem' }}>Contact Safety Team</Link>
          </div>
        </section>

      </div>
    </main>
  );
}
