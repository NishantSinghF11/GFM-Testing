"use client";

import React from 'react';
import Link from 'next/link';

export default function PrivacySafetyPage() {
  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px', overflowX: 'hidden' }}>
      
      {/* BACKGROUND ELEMENTS */}
      <div style={{ position: 'absolute', top: '0', right: '0', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '0', left: '0', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* 1. HERO SECTION */}
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 16px', borderRadius: '30px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '25px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            <i className="fa-solid fa-shield-check"></i> GFM TRUST & SAFETY
          </div>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', marginBottom: '20px', lineHeight: 1.1 }}>
            Your work, payments, and data are <span className="text-gradient">protected at every step.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9CA3AF', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            GigsForMe is built on a foundation of mutual trust. We combine advanced neural security with human-centric policies to ensure a safe, professional environment for the world's best creators and clients.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          
          {/* 2. PRIVACY FIRST */}
          <section id="privacy">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#818cf8', flexShrink: 0 }}>
                <i className="fa-solid fa-fingerprint"></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Privacy First, by Design</h2>
                <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '20px' }}>
                  Privacy isn't an afterthought at GigsForMe; it's the default. We collect only the minimum information necessary to provide a world-class experience. Your personal data is encrypted, securely stored, and never shared with unauthorized third parties.
                </p>
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#9CA3AF', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-check-circle" style={{ color: '#10b981', fontSize: '0.8rem' }}></i> Secure, encrypted storage</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-check-circle" style={{ color: '#10b981', fontSize: '0.8rem' }}></i> Minimal data collection</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-check-circle" style={{ color: '#10b981', fontSize: '0.8rem' }}></i> Full user data control</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fa-solid fa-check-circle" style={{ color: '#10b981', fontSize: '0.8rem' }}></i> No unauthorized sharing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. SECURE PAYMENTS & ESCROW PROTECTION */}
          <section id="payments" className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(16,185,129,0.2)', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#10b981', flexShrink: 0 }}>
                <i className="fa-solid fa-vault"></i>
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>GFM Vault™: Zero-Risk Payments</h2>
                <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '25px' }}>
                  We've eliminated payment friction and risk. When a client funds a project, the money is held securely in the **GFM Vault**. Creators are notified that funds are secured, but the payment is only released once the client approves the final deliverables.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: 'white' }}>Escrow Protection</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Funds are locked safely until both sides are satisfied.</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: 'white' }}>Fraud Prevention</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Real-time transaction monitoring to block suspicious activity.</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: 'white' }}>Secure Handover</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Payment release is linked directly to asset delivery.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. CLIENT & CREATOR PROTECTION */}
          <section id="protection">
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '50px' }}>Fair Protection for Both Sides</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '15px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-user-tie"></i> For Clients
                </div>
                <ul style={{ color: '#D1D5DB', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#6366f1' }}></i> Full refund guarantee for non-delivery</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#6366f1' }}></i> Protected milestone releases</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#6366f1' }}></i> Verified creator portfolios & ratings</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#6366f1' }}></i> Dispute resolution assistance</li>
                </ul>
              </div>
              <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '15px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-palette"></i> For Creators
                </div>
                <ul style={{ color: '#D1D5DB', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#10b981' }}></i> Payment secured before work starts</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#10b981' }}></i> Protection against "unlimited revisions"</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#10b981' }}></i> Clear scope and contract enforcement</li>
                  <li style={{ display: 'flex', gap: '10px' }}><i className="fa-solid fa-check" style={{ color: '#10b981' }}></i> Verified client payment methods</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. FILE SAFETY & CONTENT SECURITY */}
          <section id="files">
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Hardened File Security</h2>
                <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '20px' }}>
                  Every asset shared in GigsForMe is protected by institutional-grade security. Files are stored in private, isolated buckets and are only accessible by project participants.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className="fa-solid fa-lock-keyhole" style={{ color: '#818cf8' }}></i>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Isolated Workspaces</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Your project files are never exposed to the public internet.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className="fa-solid fa-file-shield" style={{ color: '#10b981' }}></i>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Scan on Upload</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Automatic scanning to prevent malicious file distribution.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: '300px', height: '200px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100px', height: '100px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                <i className="fa-solid fa-folder-lock fa-4x" style={{ color: 'rgba(255,255,255,0.1)' }}></i>
              </div>
            </div>
          </section>

          {/* 6. FRAUD PREVENTION & ABUSE PROTECTION */}
          <section id="fraud" style={{ background: '#0A0D14', padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign: 'center' }}>Proactive Threat Monitoring</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fa-solid fa-radar" style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '15px' }}></i>
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Suspicious Activity</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Neural patterns detect and block bots and fake accounts.</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <i className="fa-solid fa-mask" style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '15px' }}></i>
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Anti-Scam Engine</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Automated warnings for off-platform payment requests.</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <i className="fa-solid fa-handcuffs" style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '15px' }}></i>
                <div style={{ fontWeight: 700, marginBottom: '8px' }}>Identity Verification</div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Mandatory checks for high-value creative partnerships.</div>
              </div>
            </div>
          </section>

          {/* 7. PRIVACY CONTROLS FOR USERS */}
          <section id="controls">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>You are in control</h2>
              <p style={{ color: '#9CA3AF' }}>Powerful visibility settings to manage your digital presence.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { title: 'Profile Visibility', icon: 'fa-eye-slash', desc: 'Control who can see your profile and performance stats.' },
                { title: 'Portfolio Privacy', icon: 'fa-briefcase', desc: 'Mark specific projects as private or password-protected.' },
                { title: 'Communication Filter', icon: 'fa-comment-slash', desc: 'Choose who can reach out to you and initiate new deals.' },
                { title: 'Data Export', icon: 'fa-download', desc: 'Request a full copy of your data or permanently delete your account.' }
              ].map(item => (
                <div key={item.title} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <i className={`fa-solid ${item.icon}`} style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 8. SAFE COLLABORATION STANDARDS */}
          <section id="standards">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>Professional Conduct Standards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'center' }}>
              <div style={{ padding: '30px', background: 'linear-gradient(135deg, #1E2532 0%, #05070B 100%)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontStyle: 'italic', color: '#D1D5DB', lineHeight: 1.6, margin: 0 }}>
                  "GigsForMe isn't just a place to find work; it's a community built on mutual respect and professional accountability."
                </p>
              </div>
              <div>
                <ul style={{ color: '#D1D5DB', display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', padding: 0 }}>
                  <li style={{ display: 'flex', gap: '12px' }}><i className="fa-solid fa-scale-balanced" style={{ color: '#818cf8' }}></i> <strong>Respectful Communication:</strong> Zero tolerance for harassment or abuse.</li>
                  <li style={{ display: 'flex', gap: '12px' }}><i className="fa-solid fa-bullseye" style={{ color: '#818cf8' }}></i> <strong>Clear Accountability:</strong> Every project has a clear scope and timeline.</li>
                  <li style={{ display: 'flex', gap: '12px' }}><i className="fa-solid fa-hand-heart" style={{ color: '#818cf8' }}></i> <strong>Fair Feedback:</strong> Honest, constructive ratings that reflect true work quality.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 9. TRUST & SAFETY MONITORING */}
          <section id="monitoring">
            <div style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', fontSize: '2rem', color: '#6366f1' }}>
                <i className="fa-solid fa-brain-circuit"></i>
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Active Trust Monitoring</h2>
              <p style={{ color: '#9CA3AF', maxWidth: '600px', margin: '0 auto 30px' }}>
                Our systems monitor millions of signals daily to identify and isolate risks before they reach you. From behavioral analysis to trust scoring, we keep the platform's integrity intact.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800 }}>24/7</div><div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Active Monitoring</div></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800 }}>0.1%</div><div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Report Rate</div></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800 }}>99.9%</div><div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Platform Integrity</div></div>
              </div>
            </div>
          </section>

          {/* 10. REPORTING & SUPPORT */}
          <section id="reporting">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Notice something? Report it.</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '25px' }}>Our dedicated Trust & Safety team reviews all reports within 24 hours.</p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <Link href="/report" className="btn btn-primary" style={{ padding: '12px 25px' }}>Report a Concern</Link>
                  <Link href="/contact-safety" className="btn btn-outline" style={{ padding: '12px 25px' }}>Contact Safety Team</Link>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280' }}>QUICK HELP</div>
                <Link href="#" style={{ color: '#818cf8', fontSize: '0.9rem', textDecoration: 'none' }}>→ How to spot a scam</Link>
                <Link href="#" style={{ color: '#818cf8', fontSize: '0.9rem', textDecoration: 'none' }}>→ Recovering your account</Link>
                <Link href="#" style={{ color: '#818cf8', fontSize: '0.9rem', textDecoration: 'none' }}>→ Handling payment disputes</Link>
              </div>
            </div>
          </section>

          {/* 11. DATA RESPONSIBILITY */}
          <section id="responsibility">
            <div style={{ borderTop: '1px solid #1E2532', paddingTop: '60px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign: 'center' }}>Our Data Manifesto</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                <div style={{ padding: '25px', background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '24px' }}>
                  <h4 style={{ color: '#10b981', marginBottom: '10px' }}>No Data Selling</h4>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>We never have, and never will, sell your personal data or creative assets to third parties.</p>
                </div>
                <div style={{ padding: '25px', background: 'rgba(99,102,241,0.02)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '24px' }}>
                  <h4 style={{ color: '#818cf8', marginBottom: '10px' }}>Responsible AI</h4>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>Our AI models are trained exclusively on anonymized data to improve platform safety, never on your private creative IP.</p>
                </div>
                <div style={{ padding: '25px', background: 'rgba(236,72,153,0.02)', border: '1px solid rgba(236,72,153,0.1)', borderRadius: '24px' }}>
                  <h4 style={{ color: '#ec4899', marginBottom: '10px' }}>Privacy-First Growth</h4>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0 }}>We measure our success by the trust we build, not the amount of data we harvest.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 12. CLOSING TRUST STATEMENT */}
          <section id="closing" style={{ textAlign: 'center', padding: '80px 40px', background: 'linear-gradient(180deg, rgba(99,102,241,0.1) 0%, transparent 100%)', borderRadius: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Work with total confidence.</h2>
            <p style={{ fontSize: '1.1rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Privacy and safety aren't just features—they are the core of GigsForMe. We've built the platform so you can focus on what you do best: creating incredible work.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link href="/explore" className="btn btn-primary" style={{ padding: '16px 40px' }}>Get Started Safely</Link>
              <Link href="/contact-safety" className="btn btn-outline" style={{ padding: '16px 40px' }}>Talk to an Expert</Link>
            </div>
          </section>

        </div>

        <footer style={{ marginTop: '100px', textAlign: 'center', padding: '40px 0', borderTop: '1px solid #1E2532', color: '#6B7280', fontSize: '0.85rem' }}>
          <p>© 2026 GigsForMe Creative OS. All rights reserved. | <Link href="/terms" style={{ color: '#9CA3AF' }}>Terms of Service</Link> | <Link href="/cookie-policy" style={{ color: '#9CA3AF' }}>Cookie Policy</Link></p>
        </footer>

      </div>
    </main>
  );
}
