"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FlashTenders from '@/components/tenders/FlashTenders';
import type { Tender } from '@/lib/tenders';

interface TendersClientProps {
  initialTenders: Tender[];
}

export default function TendersClient({ initialTenders }: TendersClientProps) {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white' }}>
      
      {/* Header Section */}
      <section style={{ padding: '100px 20px 40px', background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '15px' }}>Opportunities Hub</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Project <span className="text-gradient">Tender Feed</span></h1>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Compete for high-stakes projects from elite clients. Use your Match Score to find the perfect fit.
          </p>
        </div>
      </section>

      {/* Main Feed */}
      <section style={{ padding: '20px 20px 100px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* FLASH TENDERS INJECTION */}
          <FlashTenders />

          {/* Filters */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', justifyContent: 'center' }}>
            {['all', 'Video Editing', '3D Animation', 'Motion Graphics'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '8px 20px' }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Tender Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {initialTenders.filter(t => filter === 'all' || t.category === filter).map(tender => (
              <div key={tender.id} className="glass-card hover-glow premium-border" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '30px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '1px' }}>{tender.category}</span>
                    <span style={{ color: '#374151' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{tender.client_name}</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{tender.title}</h3>
                  <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {tender.description}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {tender.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.05)' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '30px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '5px', textTransform: 'uppercase' }}>Budget</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{tender.budget_range}</div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginBottom: '5px', textTransform: 'uppercase' }}>Match Score</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{tender.match_score}%</div>
                    </div>
                  </div>

                  <Link href={`/tenders/${tender.id}`} className="btn btn-primary animate-shimmer" style={{ width: '100%', fontSize: '0.85rem' }}>View & Bid</Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
