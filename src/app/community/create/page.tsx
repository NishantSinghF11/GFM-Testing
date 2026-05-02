"use client";

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to start a discussion.');
        return;
      }

      const { error } = await supabase
        .from('community_threads')
        .insert({
          author_id: user.id,
          title,
          content,
          category
        });

      if (error) throw error;

      router.push('/community');
      router.refresh();
    } catch (err) {
      console.error('Thread creation error:', err);
      alert('Failed to start discussion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Community', item: '/community' },
    { name: 'New Discussion', item: '/community/create' }
  ];

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Start <span className="text-gradient">Discussion</span></h1>
          <p style={{ color: '#9CA3AF', marginTop: '10px' }}>Share an insight, ask a question, or debate a strategy.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', marginBottom: '10px' }}>Discussion Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. How will Neural Design impact the 2026 marketplace?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', borderRadius: '15px', color: 'white', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', marginBottom: '10px' }}>Category</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['general', 'strategy', 'intelligence', 'production', 'marketplace'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: category === cat ? '2px solid #6366f1' : '1px solid #374151',
                    background: category === cat ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: category === cat ? '#A5B4FC' : '#9CA3AF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', marginBottom: '10px' }}>Your Perspective</label>
            <textarea 
              required
              placeholder="Dive into the details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', height: '250px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', borderRadius: '20px', color: 'white', fontSize: '1rem', lineHeight: 1.6, resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button 
              type="button" 
              onClick={() => router.back()}
              style={{ flex: 1, padding: '18px', borderRadius: '15px', border: '1px solid #374151', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-primary animate-shimmer"
              style={{ flex: 2, padding: '18px', borderRadius: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              {submitting ? 'Broadcasting...' : 'Publish Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
