import React from 'react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = constructMetadata({
  title: "The GFM Protocol | Trust, Safety & AI Mediation",
  description: "Learn how GigsForMe protects creators and clients with our neutral Vault system, AI-driven mediation, and cryptographic smart contracts.",
  canonical: getCanonicalUrl('/protocol'),
});

export default function ProtocolPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Protocol', item: '/protocol' }
  ];

  return (
    <div style={{ background: '#05070B', color: 'white', minHeight: '100vh' }}>
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      {/* Hero Section */}
      <section style={{ padding: '160px 20px 100px', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 60%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-primary" style={{ marginBottom: '20px' }}>Trust & Safety Layer</span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
            The <span className="text-gradient">GFM Protocol</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9CA3AF', lineHeight: 1.6 }}>
            GigsForMe is the first creative marketplace that replaces blind trust with cryptographic certainty and AI-mediated fairness.
          </p>
        </div>
      </section>

      {/* The 3 Pillars */}
      <section style={{ padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* Pillar 1: The Vault */}
          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(16,185,129,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '1.8rem', marginBottom: '25px' }}>
              <i className="fa-solid fa-vault"></i>
            </div>
            <h2 style={{ marginBottom: '20px' }}>GFM Vault & Escrow</h2>
            <p style={{ color: '#D1D5DB', lineHeight: 1.8, marginBottom: '25px' }}>
              Every deal on GFM is backed by our neutral Vault system. When a client funds a milestone, the money is held in secure escrow. Creators can see the funds are secured before they start, and clients only release payment when the work is approved.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><i className="fa-solid fa-check" style={{ color: '#10b981', marginRight: '10px' }}></i> Milestone-based releases</li>
              <li><i className="fa-solid fa-check" style={{ color: '#10b981', marginRight: '10px' }}></i> Encrypted asset transfers</li>
              <li><i className="fa-solid fa-check" style={{ color: '#10b981', marginRight: '10px' }}></i> Verification-locked payments</li>
            </ul>
          </div>

          {/* Pillar 2: AI Mediation */}
          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.8rem', marginBottom: '25px' }}>
              <i className="fa-solid fa-brain"></i>
            </div>
            <h2 style={{ marginBottom: '20px' }}>AI Resolution Center</h2>
            <p style={{ color: '#D1D5DB', lineHeight: 1.8, marginBottom: '25px' }}>
              Disputes are a part of business, but they shouldn't take weeks to solve. Our AI Resolution Center acts as a neutral, data-driven mediator to suggest fair settlements (refunds, revisions, or credits) based on the original Deal Specification Sheet.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><i className="fa-solid fa-check" style={{ color: '#818cf8', marginRight: '10px' }}></i> 24/7 instant mediation</li>
              <li><i className="fa-solid fa-check" style={{ color: '#818cf8', marginRight: '10px' }}></i> Context-aware settlements</li>
              <li><i className="fa-solid fa-check" style={{ color: '#818cf8', marginRight: '10px' }}></i> Zero bias or human friction</li>
            </ul>
          </div>

          {/* Pillar 3: Smart Contracts */}
          <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(168,85,247,0.2)' }}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(168,85,247,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.8rem', marginBottom: '25px' }}>
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <h2 style={{ marginBottom: '20px' }}>Digital Contracts</h2>
            <p style={{ color: '#D1D5DB', lineHeight: 1.8, marginBottom: '25px' }}>
              Every "Smart Offer" accepted on GFM automatically generates a legally formal Deal Specification Sheet. This document includes verified electronic signatures and cryptographic stamps to ensure all terms are immutable and enforceable.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, color: '#9CA3AF', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><i className="fa-solid fa-check" style={{ color: '#c084fc', marginRight: '10px' }}></i> Verified e-signatures</li>
              <li><i className="fa-solid fa-check" style={{ color: '#c084fc', marginRight: '10px' }}></i> Immutable scope tracking</li>
              <li><i className="fa-solid fa-check" style={{ color: '#c084fc', marginRight: '10px' }}></i> Cryptographic proof of terms</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Secure Payment Flow */}
      <section style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '50px' }}>Secure Payment Lifecycle</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ flex: 1 }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1E2532', border: '2px solid #818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.2rem', fontWeight: 700 }}>1</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>Negotiate</div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>AI assists in defining fair terms</p>
            </div>
            <i className="fa-solid fa-arrow-right" style={{ color: '#1E2532' }}></i>
            {/* Step 2 */}
            <div style={{ flex: 1 }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1E2532', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.2rem', fontWeight: 700 }}>2</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>Fund Vault</div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Escrow secured via Razorpay</p>
            </div>
            <i className="fa-solid fa-arrow-right" style={{ color: '#1E2532' }}></i>
            {/* Step 3 */}
            <div style={{ flex: 1 }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1E2532', border: '2px solid #c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.2rem', fontWeight: 700 }}>3</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '5px' }}>Approve</div>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Review work and release funds</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Ready for a safer creative experience?</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>Join the GFM network today and work with complete confidence.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/register" className="btn btn-primary" style={{ padding: '15px 40px' }}>Get Started</Link>
            <Link href="/explore" className="btn btn-outline" style={{ padding: '15px 40px' }}>Explore Gigs</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
