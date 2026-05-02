"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Contributor {
  id: string;
  name: string;
  avatar_url: string;
  post_count: number;
}

export default function ActiveContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchContributors() {
      try {
        // Fetch all blogs to count per author manually (or use a view/rpc)
        // For simplicity and real-time feel, we fetch and aggregate
        const { data: blogData } = await supabase
          .from('blogs')
          .select('author_id');

        if (!blogData) return;

        const counts: Record<string, number> = {};
        blogData.forEach(blog => {
          counts[blog.author_id] = (counts[blog.author_id] || 0) + 1;
        });

        // Get unique author IDs
        const authorIds = Object.keys(counts);
        if (authorIds.length === 0) return;

        // Fetch profile details
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', authorIds);

        if (profileData) {
          const combined = profileData.map(p => ({
            ...p,
            post_count: counts[p.id]
          })).sort((a, b) => b.post_count - a.post_count).slice(0, 5);

          setContributors(combined);
        }
      } catch (err) {
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributors();
  }, [supabase]);

  if (loading) return (
    <div className="glass-card" style={{ padding: '20px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ color: '#6366f1' }}></i>
    </div>
  );

  if (contributors.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <i className="fa-solid fa-ranking-stars" style={{ color: '#FCD34D' }}></i>
        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Top Strategists</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {contributors.map((c, idx) => (
          <Link 
            key={c.id} 
            href={`/profile/${c.id}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6366f1&color=fff`} 
                  alt={c.name}
                  style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  left: '-5px', 
                  width: '18px', 
                  height: '18px', 
                  background: idx === 0 ? '#FCD34D' : '#9CA3AF', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  color: '#000',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}>
                  {idx + 1}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{c.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                  {c.post_count} Insights Shared
                </div>
              </div>
            </div>
            {c.post_count >= 5 && (
              <i className="fa-solid fa-certificate" style={{ color: '#6366f1', fontSize: '0.8rem' }} title="Verified Strategic Contributor"></i>
            )}
          </Link>
        ))}
      </div>

      <button style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid #374151', color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: '0.3s' }}>
        VIEW ALL CONTRIBUTORS
      </button>
    </div>
  );
}
