"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// ── Accordion FAQ item ──────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        borderBottom: '1px solid #1E2532',
        paddingBottom: open ? '25px' : '20px',
        cursor: 'pointer',
        transition: 'padding 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: open ? '#818cf8' : 'white', transition: 'color 0.2s' }}>
          {q}
        </div>
        <i
          className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}
          style={{ color: open ? '#818cf8' : '#4B5563', fontSize: '0.8rem', flexShrink: 0, transition: 'color 0.2s' }}
        ></i>
      </div>
      {open && (
        <div style={{ marginTop: '15px', color: '#9CA3AF', lineHeight: 1.7, fontSize: '0.95rem', animation: 'fadeIn 0.2s ease' }}>
          {a}
        </div>
      )}
    </div>
  );
}


// ── Full FAQ Section ─────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    category: 'Payments & Vault',
    color: '#10b981',
    icon: 'fa-vault',
    items: [
      { q: 'How does the GFM Vault protect my money?', a: 'Funds are only released to the creator once you formally approve the final deliverables in the Workspace. Until then, GFM holds the funds in neutral, fully audited escrow. You are always in control.' },
      { q: 'What payment methods are supported?', a: 'GFM supports all major credit/debit cards, UPI, net banking, and digital wallets via our Razorpay integration. International payments are processed securely in your local currency.' },
      { q: 'How fast do creators get paid after approval?', a: 'Payouts are typically initiated within 24 hours of your formal approval in the Workspace. Processing times may vary based on the creator\'s bank, but GFM targets same-business-day processing.' },
      { q: 'What is the refund policy?', a: 'If a creator fails to deliver, GFM initiates a full escrow refund to the client. Partial refunds are available in dispute cases, subject to mediation review of the Workspace history and original brief.' },
    ]
  },
  {
    category: 'AI & Matching',
    color: '#818cf8',
    icon: 'fa-brain',
    items: [
      { q: 'How does the AI Matchmaker find the right creator?', a: 'The Neural Matchmaker analyzes your project brief, budget, timeline, and aesthetic preferences to compute a Synergy Score for each creator in the network. It surfaces the top matches with transparent reasoning for each recommendation.' },
      { q: 'Can I override an AI recommendation?', a: 'Absolutely. AI recommendations are a starting point, not a mandate. You can browse the full marketplace, post a Public Tender, or reach out directly to any creator at any time.' },
      { q: 'Is my data used to train GFM\'s AI models?', a: 'No. GFM\'s AI systems are trained exclusively on anonymized, aggregate behavioral data. Your private project files, messages, and creative assets are never used for model training.' },
    ]
  },
  {
    category: 'Disputes & Safety',
    color: '#ef4444',
    icon: 'fa-shield-halved',
    items: [
      { q: 'What happens if a project goes out of scope?', a: 'Our AI-assisted Scope Firewall monitors incoming messages for out-of-scope requests and automatically flags them. Creators can send a formal Add-on Smart Offer to adjust terms for additional work, keeping everything on-record.' },
      { q: 'How does GFM handle a dispute between client and creator?', a: 'Our Trust & Safety team reviews all evidence submitted through the Workspace — including file uploads, chat history, and the original brief. A resolution is typically issued within 3–5 business days.' },
      { q: 'How do I report abusive or fraudulent behaviour?', a: 'Use the "Report a Concern" button inside any message thread, project page, or from the Privacy & Safety page. Our team reviews all reports within 24 hours and takes immediate action on confirmed violations.' },
    ]
  },
  {
    category: 'Account & Data',
    color: '#f59e0b',
    icon: 'fa-user-shield',
    items: [
      { q: 'How do I become a Verified Pro creator?', a: 'Creators are verified based on their Trust Ledger score (completion rate, client satisfaction), portfolio quality, and a minimum number of successful project completions on the platform.' },
      { q: 'Can I export my project data and files?', a: 'Yes. Both clients and creators have full data portability rights. You can request a full export of your account data, messages, invoices, and project files at any time via the Settings → Privacy panel.' },
    ]
  },
];

function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('Payments & Vault');
  const [askSubmitted, setAskSubmitted] = useState(false);
  const [question, setQuestion] = useState('');

  const current = FAQ_ITEMS.find(c => c.category === activeCategory)!;

  return (
    <section className="animate-fade-in">
      <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>17 / SUPPORT</span>
      <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 10px' }}>Frequently Asked Questions</h1>
      <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>Click any question to expand the answer.</p>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {FAQ_ITEMS.map(cat => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            style={{
              padding: '8px 18px',
              borderRadius: '30px',
              border: `1px solid ${activeCategory === cat.category ? cat.color : '#1E2532'}`,
              background: activeCategory === cat.category ? `rgba(${cat.color === '#10b981' ? '16,185,129' : cat.color === '#818cf8' ? '129,140,248' : cat.color === '#ef4444' ? '239,68,68' : '245,158,11'},0.1)` : 'transparent',
              color: activeCategory === cat.category ? cat.color : '#6B7280',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Accordion Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '70px' }}>
        {current.items.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>

      {/* ASK YOUR OWN QUESTION */}
      <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '32px', padding: '50px 40px', textAlign: 'center' }}>
        {askSubmitted ? (
          <div>
            <div style={{ width: '70px', height: '70px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#10b981', margin: '0 auto 20px' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Question Received!</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '25px' }}>Our docs team will review your question and add it to this FAQ within 24–48 hours.</p>
            <button onClick={() => { setAskSubmitted(false); setQuestion(''); }} style={{ background: 'transparent', border: '1px solid #1E2532', color: '#9CA3AF', padding: '10px 25px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
              Ask Another Question
            </button>
          </div>
        ) : (
          <div>
            <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#818cf8', margin: '0 auto 20px' }}>
              <i className="fa-solid fa-circle-question"></i>
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Can't find your answer?</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
              Ask your question directly and our team will answer it — and add it to our documentation for the community.
            </p>
            <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', borderRadius: '12px', padding: '14px 18px', color: 'white', fontSize: '0.95rem', outline: 'none' }}
              />
              <button
                onClick={() => question.trim() && setAskSubmitted(true)}
                className="btn btn-primary"
                style={{ padding: '14px 24px', borderRadius: '12px', whiteSpace: 'nowrap' }}
              >
                <i className="fa-solid fa-paper-plane"></i> Submit
              </button>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link href="/help" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}>
                <i className="fa-solid fa-life-ring"></i> Visit Help Center
              </Link>
              <Link href="/report" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none' }}>
                <i className="fa-solid fa-headset"></i> Contact Safety Team
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main Documentation Page ──────────────────────────────────────────────────

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'introduction', label: '1. Introduction', icon: 'fa-book-open' },
    { id: 'platform-overview', label: '2. Platform Overview', icon: 'fa-layer-group' },
    { id: 'platform-roles', label: '3. Core Platform Roles', icon: 'fa-users-gear' },
    { id: 'client-workflow', label: '4. Client Workflow', icon: 'fa-user-tie' },
    { id: 'creator-workflow', label: '5. Creator Workflow', icon: 'fa-palette' },
    { id: 'smart-inbox', label: '6. Smart Inbox', icon: 'fa-comment-dots' },
    { id: 'workspace', label: '7. Creative Workspace', icon: 'fa-desktop' },
    { id: 'tenders', label: '8. Tender Board System', icon: 'fa-gavel' },
    { id: 'payments', label: '9. Payments & Escrow', icon: 'fa-vault' },
    { id: 'trust-safety', label: '10. Trust & Safety', icon: 'fa-shield-halved' },
    { id: 'ai-systems', label: '11. AI Architecture', icon: 'fa-brain-circuit' },
    { id: 'post-approval', label: '12. Post-Approval Systems', icon: 'fa-box-open' },
    { id: 'studio-module', label: '13. Project Studio', icon: 'fa-clapperboard' },
    { id: 'intelligence-hub', label: '14. Intelligence Hub', icon: 'fa-chart-line' },
    { id: 'safety-center', label: '15. Safety Command Center', icon: 'fa-user-lock' },
    { id: 'core-modules', label: '16. Platform Modules', icon: 'fa-cubes' },
    { id: 'ux-principles', label: '17. UX Principles', icon: 'fa-wand-magic-sparkles' },
    { id: 'differentiation', label: '18. Differentiation', icon: 'fa-rocket' },
    { id: 'glossary', label: '19. Glossary', icon: 'fa-list-ul' },
    { id: 'faq', label: '20. FAQ', icon: 'fa-question-circle' }
  ];

  const filteredItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', display: 'flex', overflow: 'hidden', paddingTop: '80px' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ width: '320px', background: '#0A0D14', borderRight: '1px solid #1E2532', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: '80px', height: 'calc(100vh - 80px)', zIndex: 10 }}>
        <div style={{ padding: '25px 30px', borderBottom: '1px solid #1E2532' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#818cf8' }}>
             <i className="fa-solid fa-book-bookmark" style={{ fontSize: '0.8rem' }}></i>
             <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>GFM Platform Docs</span>
          </div>
          <div style={{ position: 'relative' }}>
            <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563', fontSize: '0.8rem' }}></i>
            <input 
              type="text" 
              placeholder="Search documentation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '10px', padding: '10px 10px 10px 35px', color: 'white', fontSize: '0.85rem', outline: 'none' }} 
            />
          </div>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 15px' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => { setActiveSection(item.id); if(searchQuery) setSearchQuery(''); }}
                style={{ 
                  padding: '12px 15px', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  transition: 'all 0.2s',
                  background: activeSection === item.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: activeSection === item.id ? '#818cf8' : '#9CA3AF',
                  fontWeight: activeSection === item.id ? 700 : 400
                }}
              >
                <i className={`fa-solid ${item.icon}`} style={{ width: '20px', textAlign: 'center' }}></i>
                {item.label}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#4B5563', fontSize: '0.85rem' }}>
              No sections found for "{searchQuery}"
            </div>
          )}
        </nav>
      </aside>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '80px 60px 100px', scrollBehavior: 'smooth', marginLeft: '320px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {/* 1. INTRODUCTION */}
          {activeSection === 'introduction' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>01 / GETTING STARTED</span>
              <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>What is GigsForMe?</h1>
              <p style={{ fontSize: '1.2rem', color: '#D1D5DB', lineHeight: 1.7, marginBottom: '30px' }}>
                GigsForMe (GFM) is a next-generation, AI-native creative freelance platform designed to replace transactional gig boards with a high-fidelity **Creative Operating System**.
              </p>
              <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '24px', padding: '40px', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>Platform Intent</h3>
                <p style={{ color: '#9CA3AF', lineHeight: 1.6 }}>
                  Built for the world's most talented creators and ambitious clients, GFM provides the infrastructure for seamless collaboration, cryptographically secure payments, and AI-mediated growth. We exist to solve the core friction points of the modern creator economy: mismatched talent, scope creep, and payment insecurity.
                </p>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Key Differentiators</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginTop: '5px' }}></i>
                  <div><strong>AI-First Discovery:</strong> No more searching; our Matchmaker uses neural reasoning to find the perfect pairing.</div>
                </li>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginTop: '5px' }}></i>
                  <div><strong>Institutional Escrow:</strong> The GFM Vault ensures payments are never a guessing game.</div>
                </li>
                <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginTop: '5px' }}></i>
                  <div><strong>Cinematic Review:</strong> A pro-grade workspace for frame-by-frame asset revision.</div>
                </li>
              </ul>
            </section>
          )}

          {/* 2. PLATFORM OVERVIEW */}
          {activeSection === 'platform-overview' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>02 / ARCHITECTURE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Platform Architecture</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '40px' }}>
                GFM is built on a distributed, state-driven architecture that synchronizes communication, production, and finance into a single high-fidelity pipeline.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#818cf8' }}>Decision Layer</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Powered by the AI Matchmaker and Tender Board, this layer handles all talent discovery and hiring logic.</div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#10b981' }}>Execution Layer</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>The Creative Workspace and Smart Inbox facilitate real-time production and negotiation.</div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#f59e0b' }}>Financial Layer</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>The GFM Vault and Escrow Protocol ensure secure fund management and milestone release.</div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#ec4899' }}>Trust Layer</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>A pervasive system of verification, transparency, and safety monitoring.</div>
                </div>
              </div>
            </section>
          )}

          {/* 3. CORE PLATFORM ROLES */}
          {activeSection === 'platform-roles' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>03 / IDENTITY</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Platform Roles</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ borderLeft: '3px solid #6366f1', paddingLeft: '30px' }}>
                  <h3 style={{ marginBottom: '10px' }}>The Client</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Business owners, agency directors, and visionaries looking to outsource creative tasks. Clients have access to the AI Matchmaker, Tender Board, and the GFM Vault.</p>
                </div>
                <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '30px' }}>
                  <h3 style={{ marginBottom: '10px' }}>The Creator</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>Professional editors, designers, colorists, and VFX artists. Creators build high-fidelity profiles, manage production inventory, and leverage the Smart Inbox for negotiation.</p>
                </div>
                <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '30px' }}>
                  <h3 style={{ marginBottom: '10px' }}>The AI Assistant (GFM Pulse)</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>A persistent background layer that assists both roles. It summarizes briefs, optimizes offers, detects scope creep, and mediates communication.</p>
                </div>
              </div>
            </section>
          )}

          {/* 4. CLIENT WORKFLOW */}
          {activeSection === 'client-workflow' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>04 / USER JOURNEY</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Client Workflow</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { step: '01', title: 'Intent Definition', desc: 'Define your creative goals using the AI Brief Helper to ensure clarity and precision.' },
                  { step: '02', title: 'Talent Acquisition', desc: 'Use the AI Matchmaker for instant recommendations or post a Public Tender for bids.' },
                  { step: '03', title: 'Negotiation & Hire', desc: 'Discuss terms in the Smart Inbox and fund the GFM Vault to initialize the contract.' },
                  { step: '04', title: 'Production Oversight', desc: 'Monitor progress in the Creative Workspace, providing frame-by-frame feedback.' },
                  { step: '05', title: 'Approval & Asset Reuse', desc: 'Approve final work to release funds and unlock the Delivery Locker for asset management.' }
                ].map(item => (
                  <div key={item.step} style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #1E2532', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'rgba(99,102,241,0.5)' }}>{item.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. CREATOR WORKFLOW */}
          {activeSection === 'creator-workflow' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>05 / USER JOURNEY</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Creator Workflow</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { step: '01', title: 'Profile & Intelligence', desc: 'Set up your high-fidelity profile and Talent Intelligence metrics to stand out.' },
                  { step: '02', title: 'Discovery & Bidding', desc: 'Browse the Tender Board or receive direct matches via the AI Matchmaker.' },
                  { step: '03', title: 'Smart Negotiation', desc: 'Convert inquiries into Smart Offers using the AI-optimized deal composer.' },
                  { step: '04', title: 'High-Fidelity Delivery', desc: 'Execute work and upload versions to the Workspace for client review.' },
                  { step: '05', title: 'Payout & Reputation', desc: 'Receive funds from the Vault and build your Trust Ledger with successful completions.' }
                ].map(item => (
                  <div key={item.step} style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #1E2532', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'rgba(16,185,129,0.5)' }}>{item.step}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. SMART INBOX */}
          {activeSection === 'smart-inbox' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>06 / COMMUNICATION</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Smart Inbox</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '30px' }}>
                The Smart Inbox is more than a chat app; it is a live **Negotiation Center** that bridges the gap between conversation and contract.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Actionable Deal Cards</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>Directly within the chat, send and receive **Smart Offers**. These cards contain immutable terms, milestones, and price points that become the contract once funded.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Sentiment Analysis</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>The AI monitors conversation tone and sentiment to help both parties navigate negotiations with professional clarity.</p>
                </div>
              </div>
            </section>
          )}

          {/* 7. WORKSPACE */}
          {activeSection === 'workspace' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>07 / PRODUCTION</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Creative Workspace</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '30px' }}>
                The Workspace is the production heart of GigsForMe. It provides pro-grade tools for asset review, version control, and final delivery.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '32px', border: '1px solid #1E2532', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>Key Capabilities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: '#818cf8', fontSize: '1.2rem' }}><i className="fa-solid fa-play-circle"></i></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Frame-by-Frame Review</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Timestamped feedback on video assets for pinpoint precision.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: '#818cf8', fontSize: '1.2rem' }}><i className="fa-solid fa-code-branch"></i></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Version Lineage</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Seamlessly switch between V1, V2, and Final to track evolution.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: '#818cf8', fontSize: '1.2rem' }}><i className="fa-solid fa-cloud-upload"></i></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Isolated Asset Storage</div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Hardened storage ensures assets are only accessible by participants.</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 8. TENDERS */}
          {activeSection === 'tenders' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>08 / PROCUREMENT</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Tender Board System</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '30px' }}>
                For large-scale or complex projects, the Tender Board provides a formal, competitive bidding environment.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #1E2532' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px' }}>Sealed Bidding</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Creators submit bids that remain hidden from competitors, ensuring fair market pricing.</div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #1E2532' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px' }}>AI Ranking</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Incoming bids are automatically ranked by synergy, price logic, and historical success.</div>
                </div>
              </div>
            </section>
          )}

          {/* 9. PAYMENTS */}
          {activeSection === 'payments' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>09 / FINANCE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Payments & GFM Vault</h1>
              <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(16,185,129,0.2)', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 100%)', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>The Escrow Protocol</h3>
                <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '25px' }}>
                  GigsForMe uses a neutral escrow system. When a milestone is funded, the money is held by GFM. It is only released to the creator once the client provides formal approval of the deliverables.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>100%</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Escrow Guarantee</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>SSL</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Encrypted Payouts</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>24h</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Payout Velocity</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 10. TRUST & SAFETY */}
          {activeSection === 'trust-safety' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>10 / GOVERNANCE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Trust & Safety Systems</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ef4444' }}>The Trust Ledger</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>An immutable record of every user's transaction history, completion rates, and feedback quality. Trust scores determine platform privileges and visibility.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', border: '1px solid #1E2532' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Dispute Mediation</h3>
                  <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>In the event of a disagreement, our specialized mediation team reviews the Workspace history, brief requirements, and deliverables to provide a fair, evidence-based resolution.</p>
                </div>
              </div>
            </section>
          )}

          {/* 11. AI SYSTEMS */}
          {activeSection === 'ai-systems' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>11 / NEURAL ARCHITECTURE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>AI Systems</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[
                  { name: 'AI Brief Helper', desc: 'Converts vague ideas into structured, high-fidelity project briefs.' },
                  { name: 'Neural Matchmaker', desc: 'Predictive talent discovery based on skill depth and project intent.' },
                  { name: 'Offer Optimizer', desc: 'Suggests competitive pricing and milestone structures based on market data.' },
                  { name: 'GhostPM', desc: 'Autonomous monitoring of project timelines and delivery heartbeats.' }
                ].map(item => (
                  <div key={item.name} style={{ padding: '25px', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '16px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: '#818cf8' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 12. POST-APPROVAL */}
          {activeSection === 'post-approval' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>12 / LIFECYCLE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Post-Approval Systems</h1>
              <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '32px', padding: '40px' }}>
                <h3 style={{ marginBottom: '25px' }}>The Delivery Locker</h3>
                <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '30px' }}>
                  Once a project is approved, it enters the **Delivery & Reuse Mode**. Final assets are moved to a high-speed, managed locker where clients can download, reuse, and re-order variants instantly.
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
                    <i className="fa-solid fa-repeat" style={{ color: '#818cf8', marginBottom: '10px' }}></i>
                    <div style={{ fontSize: '0.85rem' }}>One-Click Reorders</div>
                  </div>
                  <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
                    <i className="fa-solid fa-wand-magic" style={{ color: '#818cf8', marginBottom: '10px' }}></i>
                    <div style={{ fontSize: '0.85rem' }}>Variant Generation</div>
                  </div>
                  <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
                    <i className="fa-solid fa-id-card" style={{ color: '#818cf8', marginBottom: '10px' }}></i>
                    <div style={{ fontSize: '0.85rem' }}>Portfolio Rights</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 13. PROJECT STUDIO */}
          {activeSection === 'studio-module' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>13 / PRODUCTION HUB</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Project Studio</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '40px' }}>
                The Project Studio is the specialized production hub where creative vision is transformed into high-fidelity reality. It provides creators with a focused environment for asset management and AI-assisted delivery.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div style={{ padding: '25px', background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#818cf8' }}>Predictive Timeline</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>GhostPM™ analyzes milestone health and predicts completion dates, flagging potential bottlenecks before they happen.</div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', color: '#10b981' }}>Technical AI Scan</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Every uploaded asset undergoes an automated QC scan for resolution, bit-rate, and color-space compliance.</div>
                </div>
              </div>
            </section>
          )}

          {/* 14. INTELLIGENCE HUB */}
          {activeSection === 'intelligence-hub' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>14 / MARKET ANALYTICS</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Intelligence Hub</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '40px' }}>
                The Intelligence Hub provides real-time visibility into the global creative economy, helping both creators and clients make data-driven decisions.
              </p>
              <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '32px', padding: '40px', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '25px' }}>Neural Market Pulse</h3>
                <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginBottom: '20px' }}>
                  The **GFM Market Index** tracks live demand for creative skills globally. Use this data to optimize pricing (for creators) or timing (for clients).
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 800 }}>SKILL HEATMAP</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '5px' }}>Identifies trending creative styles and emerging technologies.</div>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>OPPORTUNITY RADAR</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '5px' }}>Real-time alerts for high-synergy projects and elite talent availability.</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 15. SAFETY COMMAND CENTER */}
          {activeSection === 'safety-center' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>15 / PLATFORM GOVERNANCE</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Safety Command Center</h1>
              <p style={{ color: '#D1D5DB', lineHeight: 1.7, marginBottom: '40px' }}>
                The Safety Command Center is the high-stakes interface where GFM specialists monitor platform health and resolve complex conflicts.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '25px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <i className="fa-solid fa-id-fingerprint" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
                  <div>
                    <div style={{ fontWeight: 700 }}>Cryptographic Reference IDs</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Every report (e.g., GFM-REP-XXXX) is tied to a unique hash for perfect auditability.</div>
                  </div>
                </div>
                <div style={{ padding: '25px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <i className="fa-solid fa-user-shield" style={{ fontSize: '1.5rem', color: '#818cf8' }}></i>
                  <div>
                    <div style={{ fontWeight: 700 }}>Specialist Routing</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Reports are automatically routed to the most qualified safety specialist based on category and severity.</div>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* 16. CORE MODULES */}
          {activeSection === 'core-modules' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>16 / COMPONENTS</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Platform Modules</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {['Intelligence Hub', 'Earnings Hub', 'Gigs Hub', 'Tenders Hub', 'Smart Inbox', 'Creative Workspace', 'Matchmaker Portal', 'Trust Safety Center'].map(mod => (
                  <div key={mod} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '12px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                    {mod}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 17. UX PRINCIPLES */}
          {activeSection === 'ux-principles' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>17 / PHILOSOPHY</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>UX Principles</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Action-First Interface</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: 1.6 }}>We minimize cognitive load by presenting users with clear, actionable buttons and deal-stage indicators. No more guessing what the next step is.</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Trust-by-Design</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: 1.6 }}>Every interaction is designed to build certainty. From glassmorphic payment shields to the Trust Ledger, safety is visible.</p>
                </div>
                <div>
                  <h3 style={{ marginBottom: '15px' }}>Surgical Precision</h3>
                  <p style={{ color: '#9CA3AF', lineHeight: 1.6 }}>Tools are built for professional workflows—frame-accurate video reviews, structured specification sheets, and neural talent matching.</p>
                </div>
              </div>
            </section>
          )}

          {/* 18. DIFFERENTIATION */}
          {activeSection === 'differentiation' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>18 / MARKET POSITION</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Why GigsForMe?</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid #1E2532' }}>
                  <h4 style={{ marginBottom: '20px', color: '#ef4444' }}>Traditional Marketplaces</h4>
                  <ul style={{ color: '#9CA3AF', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px' }}>
                    <li>Transactional, not operational.</li>
                    <li>Manual search and vetting.</li>
                    <li>Basic chat interfaces.</li>
                    <li>Opaque trust systems.</li>
                  </ul>
                </div>
                <div style={{ padding: '30px', background: 'rgba(99,102,241,0.05)', borderRadius: '24px', border: '1px solid #6366f1' }}>
                  <h4 style={{ marginBottom: '20px', color: '#818cf8' }}>The GFM OS</h4>
                  <ul style={{ color: '#D1D5DB', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px' }}>
                    <li>End-to-end creative infrastructure.</li>
                    <li>Neural match discovery.</li>
                    <li>Actionable Smart Inbox.</li>
                    <li>Institutional-grade GFM Vault.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 19. GLOSSARY */}
          {activeSection === 'glossary' && (
            <section className="animate-fade-in">
              <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>19 / TERMINOLOGY</span>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', margin: '20px 0 30px' }}>Glossary of Terms</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {[
                  { term: 'GFM Vault', def: 'The secure escrow system that holds project funds until approval.' },
                  { term: 'Smart Offer', def: 'An actionable deal card within the inbox that contains contract terms.' },
                  { term: 'Tender', def: 'A public project posting where creators submit sealed bids.' },
                  { term: 'Trust Ledger', def: 'The platform-wide record of a user’s behavioral and transactional health.' },
                  { term: 'GhostPM', def: 'The autonomous AI agent that monitors project timelines and deliverables.' },
                  { term: 'Taste Graph', def: 'The neural map of a client’s aesthetic preferences used for talent matching.' }
                ].map(item => (
                  <div key={item.term}>
                    <div style={{ fontWeight: 800, color: '#818cf8', marginBottom: '5px' }}>{item.term}</div>
                    <div style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.5 }}>{item.def}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 17. FAQ */}
          {activeSection === 'faq' && (
            <FAQSection />
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </main>
  );
}
