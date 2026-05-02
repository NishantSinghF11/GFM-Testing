import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import CommunityFeed from './components/CommunityFeed';
import TrendingSidebar from './components/TrendingSidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface CommunityPageProps {
  searchParams: Promise<any>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.category;
  
  // Fetch latest threads with safety fallback
  let query = supabase
    .from('community_threads')
    .select('*, author:profiles(name, avatar_url, initials)');
  
  if (activeCategory) {
    query = query.eq('category', activeCategory.toLowerCase());
  }

  const { data: threads, error: threadError } = await query.order('created_at', { ascending: false });
  if (threadError) console.error('Thread Fetch Error:', threadError);

  // Fetch top trending threads
  const { data: trendingThreads, error: trendError } = await supabase
    .from('community_threads')
    .select('id, title, views, category')
    .order('views', { ascending: false })
    .limit(5);
  if (trendError) {
    console.error('Trending Fetch Error Details:', {
      message: trendError.message,
      code: trendError.code,
      details: trendError.details
    });
  }

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Community', item: '/community' }
  ];

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 0' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '15px' }}>GFM Collective</span>
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Community <span className="text-gradient">Hub</span></h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.1rem', marginTop: '15px', maxWidth: '600px' }}>
              The decentralized core of creative strategy. Debate, upvote, and refine the future of production.
            </p>
          </div>
          <Link href="/community/create" className="btn btn-primary animate-shimmer" style={{ padding: '15px 35px' }}>
            <i className="fa-solid fa-plus" style={{ marginRight: '10px' }}></i> Start Discussion
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '50px' }}>
          {/* Main Feed */}
          <div>
            <CommunityFeed initialThreads={threads || []} />
          </div>

          {/* Sidebar */}
          <TrendingSidebar 
            trendingThreads={trendingThreads || []} 
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  );
}
