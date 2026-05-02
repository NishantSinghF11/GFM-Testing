import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { SCHEMA } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlogComments from './components/BlogComments';
import AuthorBio from './components/AuthorBio';
import SocialShare from './components/SocialShare';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import PollWidget from '../components/PollWidget';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

async function getPostData(slug: string) {
  const supabase = await createClient();
  
  // Fetch initial data
  const { data: post, error: fetchError } = await supabase
    .from('blogs')
    .select('*, author:profiles(name, initials, avatar_url, bio, is_verified, authority_level)')
    .eq('slug', slug)
    .single();

  if (fetchError || !post) return null;

  // Increment views (Non-atomic for simplicity, better to use RPC in production)
  await supabase
    .from('blogs')
    .update({ views: (post.views || 0) + 1 })
    .eq('id', post.id);

  return {
    ...post,
    views: (post.views || 0) + 1,
    date: new Date(post.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    reading_time: `${Math.ceil(post.content.split(/\s+/).length / 200)} min`
  };
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) return constructMetadata({ title: 'Post Not Found' });

  return constructMetadata({
    title: post.title,
    description: post.excerpt || post.description,
    image: post.cover_image,
    canonical: getCanonicalUrl(`/blog/${resolvedParams.slug}`),
    type: 'article',
    publishedTime: post.created_at,
    authors: [post.author?.name || 'Anonymous']
  });
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.cover_image,
    "author": {
      "@type": "Person",
      "name": post.author?.name || 'Anonymous'
    },
    "datePublished": post.created_at,
    "url": getCanonicalUrl(`/blog/${resolvedParams.slug}`)
  };

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Insights', item: '/blog' },
    { name: post.title, item: `/blog/${resolvedParams.slug}` }
  ];

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 20px 100px' }}>
      <JsonLd data={articleSchema} />
      <JsonLd data={SCHEMA.breadcrumb(breadcrumbItems)} />
      
      <article className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        <header style={{ marginBottom: '60px' }}>
          <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '20px', display: 'block', textTransform: 'uppercase' }}>{post.category}</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', marginBottom: '30px', lineHeight: 1.1 }}>{post.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <Link href={`/profile/${post.author_id}`} style={{ textDecoration: 'none' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: '#6366f1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700,
                overflow: 'hidden',
                cursor: 'pointer'
              }}>
                {post.author?.avatar_url ? (
                  <img src={post.author.avatar_url} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  post.author?.initials || '??'
                )}
              </div>
            </Link>
            <div>
              <Link href={`/profile/${post.author_id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>{post.author?.name || 'Anonymous'}</div>
                {post.author?.is_verified && <VerifiedBadge level={post.author.authority_level} />}
              </Link>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', display: 'flex', gap: '15px', alignItems: 'center', marginTop: '5px' }}>
                <span>{post.date}</span>
                <span style={{ width: '4px', height: '4px', background: '#374151', borderRadius: '50%' }}></span>
                <span>{post.reading_time}</span>
                <span style={{ width: '4px', height: '4px', background: '#374151', borderRadius: '50%' }}></span>
                <span style={{ color: '#818cf8', fontWeight: 700 }}>
                  <i className="fa-solid fa-eye" style={{ marginRight: '6px' }}></i>
                  {post.views?.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </header>

        <div 
          className="blog-content"
          style={{ 
            lineHeight: 1.8, 
            fontSize: '1.2rem', 
            color: '#D1D5DB',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
        
        {/* Interactive Participation */}
        <PollWidget blogId={post.id} />

        {/* Social Sharing Hub */}
        <SocialShare title={post.title} />

        {/* Author Bio Section */}
        {post.author && (
          <AuthorBio authorId={post.author_id} author={post.author} />
        )}

        {/* Community Discussion */}
        <BlogComments blogId={post.id} blogAuthorId={post.author_id} />

        {/* CTA */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Want more insights?</h3>
          <Link href="/blog" className="btn btn-outline" style={{ padding: '12px 30px' }}>Back to Journal</Link>
        </div>
      </article>
    </div>
  );
}
