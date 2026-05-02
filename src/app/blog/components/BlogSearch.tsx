"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ActiveContributors from './ActiveContributors';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  date: string;
  reading_time: string;
  views: number;
  author: {
    name: string;
    initials: string;
    avatar_url: string | null;
  };
}

export default function BlogSearch({ initialPosts }: { initialPosts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Trending', 'Intelligence', 'Strategy', 'Production', 'Creative Economy', 'GFM Protocol'];

  const filteredPosts = useMemo(() => {
    let results = [...initialPosts];
    
    // Sort by Trending first if selected
    if (activeCategory === 'Trending') {
      results.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (activeCategory !== 'All') {
      results = results.filter(post => post.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) || 
        post.category.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [searchQuery, activeCategory, initialPosts]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div>
      {/* Category Navigation Pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '12px 28px',
              borderRadius: '30px',
              border: activeCategory === cat 
                ? (cat === 'Trending' ? '2px solid #f59e0b' : '2px solid #6366f1') 
                : '1px solid #4B5563',
              background: activeCategory === cat 
                ? (cat === 'Trending' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)') 
                : 'rgba(255,255,255,0.03)',
              color: activeCategory === cat 
                ? (cat === 'Trending' ? '#fbbf24' : '#A5B4FC') 
                : '#D1D5DB',
              fontSize: '0.95rem',
              fontWeight: activeCategory === cat ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {cat === 'Trending' && <i className="fa-solid fa-fire-flame-curved" style={{ fontSize: '0.9rem' }}></i>}
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar Section */}
      <div style={{ marginBottom: '60px', position: 'relative' }}>
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}></i>
          <input 
            type="text" 
            placeholder="Search insights, strategies, or categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '20px 20px 20px 60px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid #4B5563', 
              borderRadius: '24px', 
              color: 'white', 
              fontSize: '1.1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#4B5563'}
          />
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <>
          {/* Top Section: Featured Post + Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', marginBottom: '80px', alignItems: 'start' }}>
            {/* Featured Post */}
            {!searchQuery && featuredPost ? (
              <Link href={`/blog/${featuredPost.slug}`} className="glass-card hover-glow" style={{ display: 'flex', flexDirection: 'column', padding: '30px', borderRadius: '40px', textDecoration: 'none', color: 'inherit', overflow: 'hidden', height: '100%' }}>
                <div style={{ position: 'relative', borderRadius: '25px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '30px' }}>
                  <img src={featuredPost.cover_image} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(99,102,241,0.9)', padding: '8px 20px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Featured Article</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '15px', textTransform: 'uppercase' }}>{featuredPost.category}</span>
                  <h2 style={{ fontSize: '2rem', marginBottom: '20px', lineHeight: 1.2 }}>{featuredPost.title}</h2>
                  <p style={{ color: '#9CA3AF', fontSize: '1rem', lineHeight: 1.6, marginBottom: '30px' }}>{featuredPost.excerpt}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', overflow: 'hidden' }}>
                      {featuredPost.author?.avatar_url ? (
                        <img src={featuredPost.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        featuredPost.author?.initials || '??'
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{featuredPost.author?.name || 'Anonymous'}</div>
                      <div>{featuredPost.date} • {featuredPost.reading_time}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                {filteredPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card hover-glow" style={{ padding: '0', borderRadius: '30px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ aspectRatio: '16/10', borderRadius: '30px 30px 0 0', overflow: 'hidden' }}>
                      <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '30px' }}>
                      <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.8rem', marginBottom: '15px', display: 'block', textTransform: 'uppercase' }}>{post.category}</span>
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', lineHeight: 1.4 }}>{post.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#6B7280' }}>
                        <span>{post.date}</span>
                        <span>•</span>
                        <div style={{ color: '#818cf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fa-solid fa-eye"></i> {post.views || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Sidebar beside Featured Post */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ActiveContributors />
            </aside>
          </div>

          {/* Regular Grid for Other Posts (Original Layout) */}
          {!searchQuery && otherPosts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px', marginBottom: '100px' }}>
              {otherPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card hover-glow" style={{ padding: '0', borderRadius: '30px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ aspectRatio: '16/10', borderRadius: '30px 30px 0 0', overflow: 'hidden' }}>
                    <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '30px' }}>
                    <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.8rem', marginBottom: '15px', display: 'block', textTransform: 'uppercase' }}>{post.category}</span>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1E2532', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', overflow: 'hidden' }}>
                        {post.author?.avatar_url ? (
                          <img src={post.author.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          post.author?.initials || '??'
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280', display: 'flex', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.reading_time}</span>
                        </div>
                        <div style={{ color: '#818cf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fa-solid fa-eye" style={{ fontSize: '0.75rem' }}></i>
                          {post.views?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <i className="fa-solid fa-face-frown fa-3x" style={{ color: '#1E2532', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '1.8rem', color: '#6B7280' }}>No insights found matching "{searchQuery}"</h3>
        </div>
      )}
    </div>
  );
}
