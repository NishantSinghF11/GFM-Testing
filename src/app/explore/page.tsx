import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ExploreClient from './ExploreClient';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { SCHEMA } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';

interface ExplorePageProps {
  searchParams: Promise<{ cat?: string; query?: string; matched?: string }>;
}

async function getExploreData() {
  const supabase = await createClient();
  
  const { data: gigsData } = await supabase
    .from('gigs')
    .select('*, creator:profiles(id, name, initials, cover_color, avatar_url)');

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('count', { ascending: false });

  const normalizedGigs = (gigsData || []).map((g: any) => ({
    ...g,
    thumb: g.thumb_color,
    price: { basic: g.price_basic, standard: g.price_standard, premium: g.price_premium },
    reviews: g.reviews_count,
    delivery: { basic: g.delivery_basic, standard: g.delivery_standard, premium: g.delivery_premium },
    tags: g.tags ?? [],
    creatorObj: { 
      name: g.creator?.name ?? 'Creator', 
      initials: g.creator?.initials ?? '??', 
      color: g.creator?.cover_color ?? 'var(--color-primary)',
      avatar_url: g.creator?.avatar_url
    }
  }));

  return { gigs: normalizedGigs, categories: categoriesData || [] };
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params.cat;
  const query = params.query;
  
  let title = "Explore Creative Services";
  let description = "Browse top-rated creative services from elite freelancers. Video editing, motion graphics, sound design, and more.";

  if (categoryId && categoryId !== 'all') {
    const formattedCat = categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    title = `Top ${formattedCat} Services`;
    description = `Hire the best ${formattedCat} experts on GigsForMe. High-stakes creative work delivered with AI-powered precision.`;
  } else if (query) {
    title = `Search results for "${query}"`;
  }

  return constructMetadata({
    title,
    description,
    canonical: getCanonicalUrl(`/explore${categoryId ? `?cat=${categoryId}` : ''}`),
  });
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const data = await getExploreData();
  const params = await searchParams;
  const categoryId = params.cat;

  const breadcrumbSchema = SCHEMA.breadcrumb([
    { name: 'Home', item: '/' },
    { name: 'Explore', item: '/explore' },
    ...(categoryId && categoryId !== 'all' ? [{ name: categoryId.replace('-', ' '), item: `/explore?cat=${categoryId}` }] : [])
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ExploreClient initialGigs={data.gigs} initialCategories={data.categories} />
    </>
  );
}
