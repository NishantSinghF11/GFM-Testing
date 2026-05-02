"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'client' | 'creator'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role: accountType }
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Network error: Could not reach Supabase. Check your internet connection and API keys. (${err?.message ?? 'Unknown error'})`);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="glass-card" style={{ padding: '50px', maxWidth: '420px', textAlign: 'center', borderRadius: 'var(--border-radius-lg)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ marginBottom: '15px' }}>Account Created!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>We've sent a confirmation email to <strong>{email}</strong>. Please check your inbox to verify your account.</p>
          <Link href="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--color-bg-darkest)' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="logo" style={{ justifyContent: 'center', marginBottom: '10px', display: 'flex' }}>
            <img src="/assets/logo.png" alt="GFM" style={{ height: '40px' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Gigs<span style={{ 
                background: 'linear-gradient(135deg, #04aafa, #3555c5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800
              }}>For</span>Me
            </span>
          </Link>
          <h2 style={{ marginTop: '20px', fontSize: '1.8rem' }}>Join GigsForMe</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '5px' }}>Create your free account today</p>
        </div>

        <div className="glass-card" style={{ padding: '40px', borderRadius: 'var(--border-radius-lg)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: 'var(--color-danger)', fontSize: '0.9rem' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{error}
            </div>
          )}

          {/* Account Type Toggle */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>I want to...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div 
                onClick={() => setAccountType('client')}
                style={{ padding: '15px', borderRadius: 'var(--border-radius)', border: `2px solid ${accountType === 'client' ? 'var(--color-primary)' : 'var(--glass-border)'}`, cursor: 'pointer', textAlign: 'center', background: accountType === 'client' ? 'rgba(139,92,246,0.1)' : 'transparent', transition: 'var(--transition)' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>💼</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hire Talent</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>I'm a client</div>
              </div>
              <div 
                onClick={() => setAccountType('creator')}
                style={{ padding: '15px', borderRadius: 'var(--border-radius)', border: `2px solid ${accountType === 'creator' ? 'var(--color-primary)' : 'var(--glass-border)'}`, cursor: 'pointer', textAlign: 'center', background: accountType === 'creator' ? 'rgba(139,92,246,0.1)' : 'transparent', transition: 'var(--transition)' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🎬</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Find Work</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>I'm a creator</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" className="form-control" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-control" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" className="form-control" placeholder="At least 8 characters" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Creating Account...</> : 'Create Free Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
