"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import NotificationCenter from '@/components/ui/NotificationCenter';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: p } = await supabase.from('profiles').select('avatar_url, name').eq('id', user.id).single();
        setProfile(p);
      }
      setLoading(false);
    };

    loadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('avatar_url, name').eq('id', session.user.id).single()
          .then(({ data: p }) => setProfile(p));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  if (pathname?.startsWith('/workspace') || pathname?.startsWith('/messages') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="navbar scrolled">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <img src="/assets/logo.png" alt="GFM Logo" />
          <span>Gigs<span style={{ 
            background: 'linear-gradient(135deg, #04aafa, #3555c5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800
          }}>For</span>Me</span>
        </Link>
        
        <div className="nav-links">
          <Link href="/explore" className="nav-link">Explore</Link>
          <Link href="/tenders" className="nav-link">Opportunities</Link>
          <Link href="/intelligence" className="nav-link" style={{ color: '#818cf8', fontWeight: 700 }}>Intelligence Hub</Link>
          <Link href="/post-tender" className="nav-link">Post a Tender</Link>
          <Link href="/ai-matchmaker" className="nav-link">AI Matchmaker</Link>
          <Link href="/protocol" className="nav-link" style={{ color: '#818cf8', fontWeight: 700 }}>GFM Protocol</Link>
        </div>
        
        <div className="nav-actions">
          {!loading && (
            <>
              {user ? (
                <>
                  {/* Logged In: show notification bell + avatar dropdown */}
                  <NotificationCenter />

                  {/* Avatar with dropdown */}
                  <div style={{ position: 'relative' }} className="notification-bell">
                    <div className="avatar" style={{ 
                      background: profile?.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--color-primary)', 
                      width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', border: '2px solid #1E2532', overflow: 'hidden', color: 'white' 
                    }}>
                      {!profile?.avatar_url && userInitials}
                    </div>
                    <div className="notifications-dropdown" style={{ minWidth: '180px' }}>
                      <div style={{ padding: '12px 15px', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.user_metadata?.full_name ?? 'Creator'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                      </div>
                      <Link href="/dashboard" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-house" style={{ marginRight: '8px', width: '16px' }}></i>Dashboard</Link>
                      <Link href="/intelligence" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-brain" style={{ marginRight: '8px', width: '16px' }}></i>Intelligence Hub</Link>
                      <Link href="/vault" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-folder-open" style={{ marginRight: '8px', width: '16px' }}></i>GFM Vault</Link>
                      <Link href="/studio" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-clapperboard" style={{ marginRight: '8px', width: '16px' }}></i>Project Studio</Link>
                      <Link href="/dashboard" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-list-check" style={{ marginRight: '8px', width: '16px' }}></i>Manage Projects</Link>
                      <Link href="/admin/support" className="notif-item" style={{ display: 'block', color: 'var(--color-danger)' }}><i className="fa-solid fa-shield-halved" style={{ marginRight: '8px', width: '16px' }}></i>Safety Command Center</Link>
                      <Link href="/settings" className="notif-item" style={{ display: 'block' }}><i className="fa-solid fa-gear" style={{ marginRight: '8px', width: '16px' }}></i>Settings</Link>
                      <div className="notif-item" style={{ cursor: 'pointer', color: 'var(--color-danger)', borderTop: '1px solid var(--glass-border)', marginTop: '5px', paddingTop: '10px' }} onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: '8px', width: '16px' }}></i>Log Out
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Logged Out: show sign in / register buttons */
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Link href="/onboarding" className="btn btn-outline" style={{ padding: '8px 18px', borderColor: '#818cf8', color: '#818cf8' }}>Complete Setup</Link>
                  <Link href="/login" className="btn btn-outline" style={{ padding: '8px 18px' }}>Sign In</Link>
                  <Link href="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>Join Free</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
