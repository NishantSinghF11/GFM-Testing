"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--color-bg-darkest)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        
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
          <h2 style={{ marginTop: '20px', fontSize: '1.8rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '5px' }}>Sign in to your account</p>
        </div>

        <div className="glass-card" style={{ padding: '40px', borderRadius: 'var(--border-radius-lg)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: 'var(--color-danger)', fontSize: '0.9rem' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)' }}>Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
