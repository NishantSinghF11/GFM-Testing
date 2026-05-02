"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PollOption {
  id: string;
  text: string;
}

interface PollWidgetProps {
  blogId: string;
}

export default function PollWidget({ blogId }: PollWidgetProps) {
  const [poll, setPoll] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPoll();
  }, [blogId]);

  async function fetchPoll() {
    try {
      const { data: pollData, error: pollError } = await supabase
        .from('blog_polls')
        .select('*')
        .eq('blog_id', blogId)
        .single();

      if (pollError || !pollData) {
        setLoading(false);
        return;
      }

      const { data: votesData, error: votesError } = await supabase
        .from('blog_poll_votes')
        .select('*')
        .eq('poll_id', pollData.id);

      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const myVote = votesData?.find(v => v.user_id === session.session.user.id);
        if (myVote) setUserVote(myVote.option_id);
      }

      setPoll(pollData);
      setVotes(votesData || []);
    } catch (err) {
      console.error('Error fetching poll:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(optionId: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      alert('Please log in to participate in the poll.');
      return;
    }

    if (userVote || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('blog_poll_votes')
        .insert({
          poll_id: poll.id,
          user_id: session.session.user.id,
          option_id: optionId
        });

      if (error) throw error;

      setUserVote(optionId);
      // Refresh votes
      const { data: newVotes } = await supabase
        .from('blog_poll_votes')
        .select('*')
        .eq('poll_id', poll.id);
      setVotes(newVotes || []);
    } catch (err) {
      console.error('Error voting:', err);
      alert('Failed to cast vote.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="glass-card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Poll...</div>;
  if (!poll) return null;

  const totalVotes = votes.length;
  const results = poll.options.map((opt: PollOption) => {
    const count = votes.filter(v => v.option_id === opt.id).length;
    const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
    return { ...opt, count, percentage };
  });

  return (
    <div className="glass-card" style={{ padding: '40px', borderRadius: '30px', border: '1px solid #4B5563', margin: '60px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fa-solid fa-square-poll-vertical" style={{ color: '#818cf8' }}></i>
        </div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{poll.question}</h4>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {results.map((opt: any) => (
          <button
            key={opt.id}
            onClick={() => handleVote(opt.id)}
            disabled={!!userVote || submitting}
            style={{
              position: 'relative',
              width: '100%',
              padding: '20px',
              borderRadius: '16px',
              border: userVote === opt.id ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
              color: 'white',
              textAlign: 'left',
              cursor: userVote ? 'default' : 'pointer',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Result Bar */}
            {userVote && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  height: '100%', 
                  width: `${opt.percentage}%`, 
                  background: userVote === opt.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 0
                }} 
              />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {userVote === opt.id && <i className="fa-solid fa-circle-check" style={{ color: '#818cf8' }}></i>}
                <span style={{ fontWeight: 600 }}>{opt.text}</span>
              </div>
              {userVote && (
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: userVote === opt.id ? '#818cf8' : '#6B7280' }}>
                  {opt.percentage}%
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between' }}>
        <span>{totalVotes} members participated</span>
        {!userVote && <span>Vote to see current sentiment</span>}
      </div>
    </div>
  );
}
