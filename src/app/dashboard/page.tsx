"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

import ClientDashboard from './components/ClientDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import MarketTicker from '@/components/dashboard/MarketTicker';
import GfmVault from '@/components/messaging/GfmVault';

import EarningsHub from './components/EarningsHub';
import GigsHub from './components/GigsHub';
import TendersHub from './components/TendersHub';
import BlogsHub from './components/BlogsHub';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'home' | 'gigs' | 'earnings' | 'tenders' | 'hires' | 'vault' | 'journal'>('home');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch user's gigs with cache busting
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      
      console.log("Dashboard: Loaded Gigs:", gigsData?.length);
      setGigs(gigsData ?? []);

      // Fetch user's orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, gig:gigs(title), client:profiles!orders_client_id_fkey(name, initials, cover_color), creator:profiles!orders_creator_id_fkey(name, initials, cover_color)')
        .or(`creator_id.eq.${user.id},client_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      setOrders(ordersData ?? []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const initials = profile?.initials || user?.user_metadata?.full_name?.slice(0, 2).toUpperCase() || 'U';
  const displayName = profile?.name || user?.user_metadata?.full_name || 'Creator';
  const isCreator = profile?.role === 'creator' || user?.user_metadata?.role === 'creator';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070B' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--color-primary)' }}></i>
      </div>
    );
  }

  return (
    <div className="dashboard-layout" style={{ background: '#05070B', color: 'white' }}>
      {/* Universal Sidebar */}
      <aside className="dashboard-sidebar" style={{ background: '#0A0D14', borderRight: '1px solid #1E2532' }}>
        <Link href="/" className="dashboard-logo">
          <img src="/assets/logo.png" alt="GFM Logo" />
          <span>Gigs<span style={{ 
            background: 'linear-gradient(135deg, #04aafa, #3555c5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800
          }}>For</span>Me</span>
        </Link>

        <div className="nav-menu">
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <i className="fa-solid fa-house"></i> {isCreator ? 'Work Engine' : 'Command Center'}
          </div>
          <Link href="/messages" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-envelope"></i> Messages
          </Link>
          
          <Link href="/intelligence" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-brain"></i> Intelligence Hub
          </Link>

          {isCreator ? (
            <>
              <div className={`nav-item ${activeTab === 'gigs' ? 'active' : ''}`} onClick={() => setActiveTab('gigs')}>
                <i className="fa-solid fa-clapperboard"></i> My Gigs
              </div>
              <div className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
                <i className="fa-solid fa-wallet"></i> Earnings & Payouts
              </div>
            </>
          ) : (
            <>
              <div className={`nav-item ${activeTab === 'tenders' ? 'active' : ''}`} onClick={() => setActiveTab('tenders')}>
                <i className="fa-solid fa-file-invoice-dollar"></i> My Tenders
              </div>
              <div className={`nav-item ${activeTab === 'hires' ? 'active' : ''}`} onClick={() => setActiveTab('hires')}>
                <i className="fa-solid fa-user-tie"></i> Managed Hires
              </div>
            </>
          )}

          <div className={`nav-item ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => setActiveTab('vault')}>
            <i className="fa-solid fa-folder-tree"></i> GFM Vault
          </div>

          <div className={`nav-item ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
            <i className="fa-solid fa-newspaper"></i> My Journal
          </div>

          <Link href="/explore" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-compass"></i> Explore
          </Link>
        </div>

        {/* Global Action Button */}
        <div style={{ padding: '0 20px', marginTop: '10px' }}>
          {isCreator ? (
            <Link href="/post-gig" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.85rem' }}>
              + Post New Gig
            </Link>
          ) : (
            <Link href="/post-tender" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-plus"></i> Post a Tender
            </Link>
          )}
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
          <Link href="/settings" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-gear"></i> Settings
          </Link>
          <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--color-danger)' }}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
          </div>
        </div>

        <div className="user-profile">
          <div className="user-avatar" style={{ background: profile?.cover_color || 'var(--color-primary)' }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{displayName}</div>
            <div style={{ fontSize: '0.8rem', color: isCreator ? '#818cf8' : '#34d399', fontWeight: 600 }}>
              {isCreator ? 'CREATOR PRO' : 'CLIENT PLUS'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Routes based on Role */}
      <main className="dashboard-main" style={{ padding: 0, overflowY: 'auto', position: 'relative' }}>
        <MarketTicker />
        
        {activeTab === 'home' && (
          <div style={{ padding: '40px' }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                  {isCreator ? 'Creator Workspace' : 'Client Command Center'}
                </h1>
                <p style={{ color: '#9CA3AF', fontSize: '1rem', margin: 0 }}>
                  {isCreator 
                    ? 'Manage your pipeline, optimize your gigs, and track your earnings.' 
                    : 'Oversee your projects, manage budgets, and approve deliverables.'}
                </p>
              </div>
            </div>

            {isCreator ? (
              <CreatorDashboard orders={orders} user={user} profile={profile} gigs={gigs} />
            ) : (
              <ClientDashboard orders={orders} user={user} profile={profile} />
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ height: 'calc(100vh - 40px)', position: 'relative' }}>
            <GfmVault 
              isOpen={true} 
              onClose={() => setActiveTab('home')} 
              currentUser={{ id: user.id, name: displayName, initials, role: isCreator ? 'creator' : 'client' }}
              addToast={() => {}}
            />
          </div>
        )}

        {activeTab === 'earnings' && (
          <div style={{ padding: '40px' }} className="animate-fade-in">
             <div style={{ marginBottom: '30px' }}>
              <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Financial Intelligence</h1>
              <p style={{ color: '#9CA3AF', fontSize: '1rem', margin: 0 }}>Real-time revenue velocity, tax compliance, and automated payout management.</p>
            </div>
            <EarningsHub orders={orders} profile={profile} />
          </div>
        )}

        {activeTab === 'gigs' && (
          <div style={{ padding: '40px' }} className="animate-fade-in">
            <GigsHub gigs={gigs} setGigs={setGigs} />
          </div>
        )}

        {(activeTab === 'tenders' || activeTab === 'hires') && (
          <div style={{ padding: '40px' }} className="animate-fade-in">
            <TendersHub orders={orders} />
          </div>
        )}

        {activeTab === 'journal' && (
          <div style={{ padding: '40px' }} className="animate-fade-in">
            <BlogsHub />
          </div>
        )}
      </main>
    </div>
  );
}
