import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SEO_CONFIG } from '@/lib/seo/config';
import { mockTenders } from '@/lib/tenders';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_CONFIG.baseUrl;
  const supabase = await createClient();

  // Static routes
  const staticRoutes = [
    '',
    '/explore',
    '/tenders',
    '/protocol',
    '/login',
    '/register',
    '/help',
    '/docs',
    '/post-gig',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Gig routes
  const { data: gigs } = await supabase.from('gigs').select('id, updated_at');
  const gigRoutes = (gigs || []).map((gig) => ({
    url: `${baseUrl}/gig/${gig.id}`,
    lastModified: new Date(gig.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic Profile routes
  const { data: profiles } = await supabase.from('profiles').select('id, created_at').eq('role', 'creator');
  const profileRoutes = (profiles || []).map((profile) => ({
    url: `${baseUrl}/profile/${profile.id}`,
    lastModified: new Date(profile.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Dynamic Tender routes
  const tenderRoutes = mockTenders.map((tender) => ({
    url: `${baseUrl}/tenders/${tender.id}`,
    lastModified: new Date(), // Mock data doesn't have updated_at
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...gigRoutes, ...profileRoutes, ...tenderRoutes];
}
