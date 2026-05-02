import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ThreadClient from './ThreadClient';

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadDetailPage({ params }: ThreadPageProps) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch thread with author
  const { data: thread } = await supabase
    .from('community_threads')
    .select('*, author:profiles(name, avatar_url, initials)')
    .eq('id', resolvedParams.id)
    .single();

  if (!thread) notFound();

  // Fetch comments
  const { data: comments } = await supabase
    .from('community_comments')
    .select('*, author:profiles(name, avatar_url, initials)')
    .eq('thread_id', resolvedParams.id)
    .order('created_at', { ascending: true });

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Community', item: '/community' },
    { name: thread.title, item: `/community/thread/${thread.id}` }
  ];

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 20px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        <ThreadClient 
          thread={thread} 
          initialComments={comments || []} 
        />
      </div>
    </div>
  );
}
