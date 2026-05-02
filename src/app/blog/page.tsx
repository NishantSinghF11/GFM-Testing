import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { SCHEMA } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { createClient } from '@/lib/supabase/server';

import BlogSearch from './components/BlogSearch';
import NewsletterHub from './components/NewsletterHub';

export const metadata = constructMetadata({
  title: "GFM Insights | Creative Management & Economy",
  description: "Explore the latest insights on high-stakes creative project management, AI collaboration, and the future of the freelance economy.",
  canonical: getCanonicalUrl('/blog'),
});

async function getBlogData() {
  const supabase = await createClient();
  
  // Fetch latest posts
  const { data: latest, error: latestError } = await supabase
    .from('blogs')
    .select('*, author:profiles(name, initials, avatar_url)')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (latestError) {
    console.error('Error fetching blogs:', latestError);
    return [];
  }

  return (latest || []).map(post => ({
    ...post,
    date: new Date(post.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    reading_time: `${Math.ceil(post.content.split(/\s+/).length / 200)} min`
  }));
}

export default async function BlogPage() {
  const latest = await getBlogData();
  
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Insights', item: '/blog' }
  ];

  if (latest.length === 0) {
    return (
      <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 20px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 style={{ fontSize: '3rem', marginBottom: '30px' }}>The <span className="text-gradient">Journal</span> is currently empty.</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>Be the first to share an insight with the community.</p>
          <Link href="/blog/community" className="btn btn-primary">Write First Insight</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white' }}>
      <JsonLd data={SCHEMA.breadcrumb(breadcrumbItems)} />
      
      {/* Header & Hero */}
      <section style={{ padding: '140px 20px 80px', background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 50%)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Breadcrumbs items={breadcrumbItems} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '15px' }}>GFM Insights</span>
              <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>GFM <span className="text-gradient">Journal</span></h1>
              <p style={{ color: '#9CA3AF', fontSize: '1.2rem', marginTop: '15px', maxWidth: '600px' }}>
                Expert perspectives on creative management, cinematic production, and the future of creative OS.
              </p>
            </div>
            <Link href="/blog/community" className="btn btn-primary animate-shimmer" style={{ padding: '15px 35px' }}>
              <i className="fa-solid fa-pen-nib" style={{ marginRight: '10px' }}></i> Share your Insight
            </Link>
          </div>

          {/* Search & Dynamic Posts */}
          <BlogSearch initialPosts={latest} />

          {/* Newsletter Hub */}
          <NewsletterHub />

        </div>
      </section>
    </div>
  );
}
