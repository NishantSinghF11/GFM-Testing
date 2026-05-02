"use client";

import React from 'react';
import Link from 'next/link';

interface TrendingPost {
  id: string;
  slug: string;
  title: string;
  views: number;
  category: string;
}

export default function TrendingInsights({ posts }: { posts: TrendingPost[] }) {
  if (posts.length === 0) return null;

  return (
    <div style={{ marginBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <i className="fa-solid fa-fire-flame-curved" style={{ color: '#f59e0b', fontSize: '1.2rem' }}></i>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>Global Trending</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {posts.map((post, idx) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="glass-card hover-glow"
            style={{ 
              padding: '20px', 
              borderRadius: '20px', 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              border: '1px solid #1E2532'
            }}
          >
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 900, 
              color: 'rgba(255,255,255,0.05)', 
              minWidth: '30px' 
            }}>
              0{idx + 1}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>{post.category}</span>
              <h4 style={{ fontSize: '1rem', margin: '5px 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h4>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="fa-solid fa-eye" style={{ fontSize: '0.7rem' }}></i>
                {post.views?.toLocaleString()} reads
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
