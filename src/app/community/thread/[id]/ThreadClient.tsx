"use client";

import React, { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ThreadClientProps {
  thread: any;
  initialComments: any[];
}

// Recursive Comment Component
const CommentNode = ({ 
  comment, 
  allComments, 
  onReply, 
  replyingTo, 
  setReplyingTo, 
  newReply, 
  setNewReply, 
  onPostReply,
  onEdit,
  onDelete,
  currentUser,
  formatDate,
  submitting,
  level = 0 
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const children = useMemo(() => 
    allComments.filter((c: any) => c.parent_id === comment.id), 
    [allComments, comment.id]
  );

  const isAuthor = currentUser?.id === comment.author_id;

  const handleUpdate = async () => {
    await onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div style={{ marginLeft: level > 0 ? '40px' : '0', borderLeft: level > 0 ? '2px solid rgba(255,255,255,0.05)' : 'none', paddingLeft: level > 0 ? '20px' : '0', marginTop: '25px' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0, overflow: 'hidden', boxShadow: '0 0 15px rgba(99,102,241,0.2)' }}>
          {comment.author?.avatar_url ? <img src={comment.author.avatar_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : (comment.author?.initials || '?')}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '18px 25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#A5B4FC' }}>{comment.author?.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>
                {formatDate(comment.created_at)}
              </span>
            </div>
            {isAuthor && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: '#D1D5DB', fontSize: '0.75rem', cursor: 'pointer', opacity: 0.8 }} title="Edit"><i className="fa-solid fa-pen"></i></button>
                <button onClick={() => onDelete(comment.id)} style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '0.75rem', cursor: 'pointer', opacity: 0.9 }} title="Delete"><i className="fa-solid fa-trash"></i></button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div style={{ marginTop: '10px' }}>
              <textarea 
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ width: '100%', height: '100px', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid #6366f1', borderRadius: '15px', color: 'white', fontSize: '0.95rem', marginBottom: '12px', resize: 'none', outline: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setIsEditing(false)} style={{ fontSize: '0.8rem', color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleUpdate} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem', borderRadius: '10px' }}>Update Perspective</button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '1rem', color: '#F3F4F6', lineHeight: 1.6, letterSpacing: '0.2px' }}>{comment.content}</p>
          )}
          
          <div style={{ marginTop: '15px', display: 'flex', gap: '20px' }}>
            <button style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <i className="fa-solid fa-arrow-up" style={{ color: '#818cf8' }}></i> {comment.upvotes}
            </button>
            <button 
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              style={{ background: 'none', border: 'none', color: replyingTo === comment.id ? '#818cf8' : '#9CA3AF', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Reply
            </button>
          </div>

          {replyingTo === comment.id && (
            <div style={{ marginTop: '15px' }}>
              <textarea 
                placeholder="Write a reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                style={{ width: '100%', height: '80px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', borderRadius: '12px', color: 'white', fontSize: '0.9rem', marginBottom: '10px', resize: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setReplyingTo(null)} style={{ fontSize: '0.75rem', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button 
                  onClick={() => onPostReply(comment.id)} 
                  disabled={submitting}
                  className="btn btn-primary" 
                  style={{ padding: '6px 15px', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {children.map((child: any) => (
        <CommentNode 
          key={child.id} 
          comment={child} 
          allComments={allComments}
          onReply={onReply}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newReply={newReply}
          setNewReply={setNewReply}
          onPostReply={onPostReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUser={currentUser}
          formatDate={formatDate}
          submitting={submitting}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export default function ThreadClient({ thread, initialComments }: ThreadClientProps) {
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [voteCount, setVoteCount] = useState(thread.upvotes - thread.downvotes);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Load user, increment views, and handle hydration
  React.useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    supabase
      .rpc('increment_thread_views', { thread_id: thread.id })
      .then(({ error }) => {
        if (error) {
          console.error('View Tracking Error Details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
        }
      });
  }, [thread.id, supabase]);

  const formatDate = (dateString: string) => {
    if (!mounted) return ''; // Avoid hydration mismatch
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handlePostComment = async (parentId: string | null = null) => {
    const content = parentId ? newReply : newComment;
    if (!content.trim()) return;
    setSubmitting(true);

    try {
      if (!user) return alert('Please login to participate.');

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url, initials')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          thread_id: thread.id,
          author_id: user.id,
          content: content,
          parent_id: parentId
        })
        .select('*')
        .single();

      if (error) throw error;

      const fullComment = { ...data, author: profile };
      setComments(prev => [...prev, fullComment]);
      
      if (parentId) {
        setNewReply('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (id: string, content: string) => {
    try {
      const { error } = await supabase
        .from('community_comments')
        .update({ content })
        .eq('id', id);

      if (error) throw error;
      setComments(prev => prev.map(c => c.id === id ? { ...c, content } : c));
    } catch (err) {
      console.error('Edit error:', err);
      alert('Failed to update comment.');
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this perspective?')) return;
    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete comment.');
    }
  };

  const rootComments = useMemo(() => 
    comments.filter(c => !c.parent_id), 
    [comments]
  );

  return (
    <div>
      {/* Main Thread Card */}
      <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', marginBottom: '50px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setVoteCount(v => v + 1)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.5rem' }}><i className="fa-solid fa-arrow-up hover-glow"></i></button>
            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{voteCount}</span>
            <button onClick={() => setVoteCount(v => v - 1)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.5rem' }}><i className="fa-solid fa-arrow-down hover-glow"></i></button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, overflow: 'hidden' }}>
                {thread.author.avatar_url ? <img src={thread.author.avatar_url} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : thread.author.initials}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#A5B4FC' }}>{thread.author.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#4B5563' }}>Broadcasting from {thread.category} • {formatDate(thread.created_at)}</div>
              </div>
            </div>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '25px', lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>{thread.title}</h1>
            <div style={{ color: '#E5E7EB', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '40px' }}>{thread.content}</div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', gap: '25px' }}>
              <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 600 }}><i className="fa-solid fa-message" style={{ color: '#818cf8' }}></i> {comments.length} Discussion Points</span>
              <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 600 }}><i className="fa-solid fa-eye" style={{ color: '#818cf8' }}></i> {thread.views?.toLocaleString() || 0} Views</span>
              <span style={{ color: '#D1D5DB', fontSize: '0.9rem', fontWeight: 600 }}><i className="fa-solid fa-share" style={{ color: '#818cf8' }}></i> Share Perspective</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Feed */}
      <div style={{ marginBottom: '100px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '25px', fontWeight: 800 }}>Global <span className="text-gradient">Debate</span></h3>
        
        {/* Root Comment Input */}
        <div style={{ marginBottom: '40px' }}>
          <textarea 
            placeholder="What is your perspective?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', borderRadius: '20px', color: 'white', fontSize: '1rem', marginBottom: '15px', resize: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => handlePostComment(null)}
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '12px 30px', borderRadius: '12px' }}
            >
              {submitting ? 'Broadcasting...' : 'Post Perspective'}
            </button>
          </div>
        </div>

        {/* Render Nested Discussion Tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {rootComments.map((comment: any) => (
            <CommentNode 
              key={comment.id} 
              comment={comment} 
              allComments={comments}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              newReply={newReply}
              setNewReply={setNewReply}
              onPostReply={handlePostComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUser={user}
              formatDate={formatDate}
              submitting={submitting}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
