"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  views?: number;
  created_at: string;
  author: {
    name: string;
    avatar_url: string | null;
    initials: string;
  };
}

export default function CommunityFeed({ initialThreads }: { initialThreads: Thread[] }) {
  const [threads, setThreads] = useState(initialThreads);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleVote = async (threadId: string, type: 1 | -1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Please login to vote.');

    try {
      const { error } = await supabase
        .from('community_thread_votes')
        .upsert({ 
          thread_id: threadId, 
          user_id: user.id, 
          vote_type: type 
        });

      if (error) throw error;

      // Optimistic update
      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            upvotes: type === 1 ? t.upvotes + 1 : t.upvotes,
            downvotes: type === -1 ? t.downvotes + 1 : t.downvotes
          };
        }
        return t;
      }));
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  if (threads.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', border: '1px dashed #374151' }}>
        <i className="fa-solid fa-comments fa-3x" style={{ color: '#1E2532', marginBottom: '20px' }}></i>
        <h3 style={{ color: '#9CA3AF' }}>No active discussions yet.</h3>
        <p style={{ color: '#4B5563' }}>Be the one to spark the first strategic debate.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {threads.map(thread => (
        <div 
          key={thread.id} 
          className="glass-card" 
          style={{ 
            display: 'flex', 
            gap: '20px', 
            padding: '25px', 
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Vote Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '0 10px' }}>
            <button 
              onClick={() => handleVote(thread.id, 1)}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.2rem', transition: '0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FCD34D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: (thread.upvotes - thread.downvotes) >= 0 ? '#fff' : '#EF4444' }}>
              {thread.upvotes - thread.downvotes}
            </span>
            <button 
              onClick={() => handleVote(thread.id, -1)}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.2rem', transition: '0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          </div>

          {/* Thread Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, overflow: 'hidden' }}>
                {thread.author.avatar_url ? <img src={thread.author.avatar_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : thread.author.initials}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818cf8' }}>{thread.author.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#4B5563' }}>• {formatDate(thread.created_at)}</span>
              <span style={{ fontSize: '0.7rem', color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase', fontWeight: 800 }}>{thread.category}</span>
            </div>

            <Link href={`/community/thread/${thread.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', lineHeight: 1.3 }}>{thread.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {thread.content}
              </p>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href={`/community/thread/${thread.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 700 }}>
                <i className="fa-solid fa-message" style={{ color: '#818cf8' }}></i> {thread.comment_count} Discussion Points
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 700 }}>
                <i className="fa-solid fa-eye" style={{ color: '#818cf8' }}></i> {thread.views?.toLocaleString() || 0} Views
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-share" style={{ color: '#818cf8' }}></i> Share
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
