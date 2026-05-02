"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function BlogsHub() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this insight?')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) setPosts(posts.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <i className="fa-solid fa-circle-notch fa-spin"></i> Loading Insights...
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>Journal <span className="text-gradient">Management</span></h2>
          <p style={{ color: '#9CA3AF' }}>Control your published insights and community contributions.</p>
        </div>
        <Link href="/blog/community" className="btn btn-primary" style={{ padding: '12px 25px' }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> New Insight
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
        {posts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <i className="fa-solid fa-pen-nib" style={{ fontSize: '3rem', opacity: 0.1, marginBottom: '20px' }}></i>
            <h3 style={{ opacity: 0.5 }}>No insights published yet.</h3>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src={post.cover_image} style={{ width: '100px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{post.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '5px' }}>
                    {post.category} • {new Date(post.created_at).toLocaleDateString()} • {post.views} views
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/blog/community?edit=${post.id}`} className="btn btn-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button onClick={() => deletePost(post.id)} className="btn btn-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <i className="fa-solid fa-trash"></i>
                </button>
                <Link href={`/blog/${post.slug}`} target="_blank" className="btn btn-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
