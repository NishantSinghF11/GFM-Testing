"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  blog_id: string;
  author_id: string;
  author: {
    name: string;
    initials: string;
    cover_color: string;
    avatar_url: string | null;
  };
  likes: { user_id: string }[];
  like_count?: number;
}

export default function BlogComments({ blogId, blogAuthorId }: { blogId: string, blogAuthorId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*, author:profiles(name, initials, cover_color, avatar_url), likes:blog_comment_likes(user_id)')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });

    if (data) {
      const formatted = data.map(c => ({
        ...c,
        like_count: c.likes?.length || 0
      }));
      setComments(formatted);
    }
  }, [blogId, supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchComments();
    checkUser();

    // Set up Realtime listener
    const channel = supabase
      .channel(`blog-comments-${blogId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blog_comments', 
        filter: `blog_id=eq.${blogId}` 
      }, () => {
        fetchComments();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'blog_comment_likes'
      }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [blogId, supabase, fetchComments]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('blog_comments')
      .insert({
        blog_id: blogId,
        author_id: user.id,
        content: newComment.trim(),
        parent_id: parentId
      });

    if (!error) {
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    }
    setSubmitting(false);
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Remove this comment?')) return;
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);
    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  const toggleLike = async (commentId: string) => {
    if (!user) return;

    const comment = comments.find(c => c.id === commentId);
    const hasLiked = comment?.likes?.some(l => l.user_id === user.id);

    if (hasLiked) {
      await supabase
        .from('blog_comment_likes')
        .delete()
        .match({ comment_id: commentId, user_id: user.id });
    } else {
      await supabase
        .from('blog_comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isBlogAuthor = comment.author_id === blogAuthorId;
    const isCommentOwner = user && comment.author_id === user.id;
    const hasLiked = comment.likes?.some(l => l.user_id === user?.id);

    return (
      <div key={comment.id} style={{ 
        display: 'flex', 
        gap: '20px', 
        marginLeft: isReply ? '60px' : '0',
        marginTop: isReply ? '10px' : '30px',
        borderLeft: isReply ? '2px solid #1E2532' : 'none',
        paddingLeft: isReply ? '20px' : '0'
      }}>
        <Link href={`/profile/${comment.author_id}`} style={{ textDecoration: 'none' }}>
          <div style={{ 
            width: isReply ? '32px' : '48px', 
            height: isReply ? '32px' : '48px', 
            borderRadius: '50%', 
            background: comment.author?.cover_color || '#1E2532', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 700, 
            flexShrink: 0, 
            fontSize: isReply ? '0.8rem' : '1rem',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            {comment.author?.avatar_url ? (
              <img src={comment.author.avatar_url} alt={comment.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              comment.author?.initials || '??'
            )}
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href={`/profile/${comment.author_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontWeight: 700, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                  {comment.author?.name || 'Anonymous'}
                </span>
              </Link>
              {isBlogAuthor && <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Author</span>}
            </div>
            <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>
              {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p style={{ color: '#D1D5DB', lineHeight: 1.6, margin: '0 0 12px' }}>{comment.content}</p>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button onClick={() => toggleLike(comment.id)} style={{ background: 'none', border: 'none', color: hasLiked ? '#818cf8' : '#6B7280', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className={`fa-${hasLiked ? 'solid' : 'regular'} fa-heart`}></i> {comment.like_count || 0}
            </button>
            {!isReply && (
              <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.85rem', cursor: 'pointer' }}>
                Reply
              </button>
            )}
            {isCommentOwner && (
              <button onClick={() => deleteComment(comment.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', opacity: 0.6 }}>
                Delete
              </button>
            )}
          </div>

          {replyTo === comment.id && (
            <div style={{ marginTop: '20px' }}>
              <form onSubmit={(e) => handleSubmit(e, comment.id)}>
                <textarea 
                  className="form-control" 
                  placeholder="Write a reply..." 
                  rows={2} 
                  autoFocus
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ background: '#0A0D14', borderRadius: '12px', padding: '15px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setReplyTo(null)} className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '5px 15px', fontSize: '0.8rem' }} disabled={submitting || !newComment.trim()}>Post Reply</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <div style={{ marginTop: '80px', borderTop: '1px solid #1E2532', paddingTop: '60px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.8rem', margin: 0 }}>Community <span className="text-gradient">Discussion</span> ({comments.length})</h3>
        <div style={{ color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-circle fa-fade" style={{ fontSize: '6px' }}></i> Real-time Active
        </div>
      </header>

      {user ? (
        !replyTo && (
          <form onSubmit={(e) => handleSubmit(e)} style={{ marginBottom: '60px' }}>
            <div className="glass-card" style={{ padding: '25px', borderRadius: '24px', border: '1px solid #1E2532' }}>
              <textarea 
                className="form-control" 
                placeholder="Share your expert perspective..." 
                rows={3} 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                style={{ background: 'transparent', border: 'none', padding: 0, resize: 'none', fontSize: '1.1rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 35px', fontSize: '0.95rem' }} disabled={submitting || !newComment.trim()}>
                  {submitting ? 'Posting...' : 'Post Insight'}
                </button>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '60px', borderRadius: '30px' }}>
          <p style={{ color: '#9CA3AF', fontSize: '1.1rem', marginBottom: '25px' }}>Join the GFM network to contribute to this discussion.</p>
          <a href="/login" className="btn btn-primary" style={{ padding: '12px 40px' }}>Log In to Participate</a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {rootComments.map(comment => (
          <div key={comment.id}>
            {renderComment(comment)}
            {comments.filter(c => c.parent_id === comment.id).map(reply => renderComment(reply, true))}
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>
            <i className="fa-regular fa-comments fa-3x" style={{ marginBottom: '20px', opacity: 0.2 }}></i>
            <p>No perspectives shared yet. Be the first to start the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
