"use client";

import React from 'react';
import Link from 'next/link';

interface TrendingThread {
  id: string;
  title: string;
  views: number;
  category: string;
}

export default function TrendingSidebar({ 
  trendingThreads, 
  activeCategory 
}: { 
  trendingThreads: TrendingThread[], 
  activeCategory?: string 
}) {
  const sectors = [
    { id: 'general', label: 'GENERAL' },
    { id: 'strategy', label: 'STRATEGY' },
    { id: 'intelligence', label: 'INTELLIGENCE' },
    { id: 'production', label: 'PRODUCTION' },
    { id: 'marketplace', label: 'MARKETPLACE' }
  ];

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Trending Debates */}
      <div className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '25px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-fire" style={{ color: '#F87171' }}></i> High-Authority Debates
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {trendingThreads.map((thread, index) => (
            <Link 
              key={thread.id} 
              href={`/community/thread/${thread.id}`}
              style={{ textDecoration: 'none', display: 'flex', gap: '15px', alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', flexShrink: 0, marginTop: '-5px' }}>{index + 1}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9rem', color: '#E5E7EB', margin: '0 0 5px 0', lineHeight: 1.4, transition: '0.2s' }} className="hover-text-primary">
                  {thread.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', color: '#6B7280', fontWeight: 700 }}>
                  <span style={{ color: '#6366f1', textTransform: 'uppercase' }}>{thread.category}</span>
                  <span>• {thread.views.toLocaleString()} Views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rules Card */}
      <div className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', color: '#9CA3AF' }}>Community Protocol</h3>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.85rem', color: '#9CA3AF' }}>
          <li><i className="fa-solid fa-shield-halved" style={{ color: '#6366f1', marginRight: '10px' }}></i> Stay Strategic & Focused</li>
          <li><i className="fa-solid fa-bolt" style={{ color: '#FCD34D', marginRight: '10px' }}></i> No Low-Effort Posts</li>
          <li><i className="fa-solid fa-network-wired" style={{ color: '#818cf8', marginRight: '10px' }}></i> Respect the Protocol</li>
        </ul>
      </div>

      {/* Active Sectors (Functional Discovery) */}
      <div className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF', margin: 0 }}>Active Sectors</h3>
          {activeCategory && (
            <Link href="/community" style={{ fontSize: '0.7rem', color: '#6366f1', textDecoration: 'none', fontWeight: 800 }}>RESET</Link>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {sectors.map(sector => (
            <Link 
              key={sector.id} 
              href={`/community?category=${sector.id}`}
              style={{ 
                background: activeCategory === sector.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', 
                padding: '8px 12px', 
                borderRadius: '10px', 
                fontSize: '0.65rem', 
                color: activeCategory === sector.id ? '#A5B4FC' : '#9CA3AF', 
                textDecoration: 'none',
                border: activeCategory === sector.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.05)', 
                fontWeight: 800, 
                transition: '0.2s' 
              }} 
              className="hover-glow"
            >
              #{sector.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
