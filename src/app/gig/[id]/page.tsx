import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import GigDetailClient from './GigDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import { constructMetadata } from '@/lib/seo/meta';
import { SCHEMA } from '@/lib/seo/schema';
import { getCanonicalUrl, getAbsoluteImageUrl } from '@/lib/seo/canonical';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GigCard from '@/components/ui/GigCard';

interface GigPageProps {
  params: Promise<{ id: string }>;
}

async function getGigData(id: string) {
  const supabase = await createClient();
  const gigId = parseInt(id);

  const { data: gig } = await supabase
    .from('gigs')
    .select('*')
    .eq('id', gigId)
    .single();

  if (!gig) return null;

  const { data: creator } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', gig.creator_id)
    .single();

  return { gig, creator };
}

export async function generateMetadata({ params }: GigPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getGigData(resolvedParams.id);

  if (!data) return constructMetadata({ title: 'Gig Not Found' });

  const { gig, creator } = data;
  
  return constructMetadata({
    title: `${gig.title} | ${creator?.name}`,
    description: gig.description?.substring(0, 160),
    image: getAbsoluteImageUrl(gig.cover_image),
    canonical: getCanonicalUrl(`/gig/${gig.id}`),
    type: 'article',
  });
}

export default async function GigDetailPage({ params }: GigPageProps) {
  const resolvedParams = await params;
  const data = await getGigData(resolvedParams.id);

  if (!data) notFound();

  const { gig, creator } = data;

  const serviceSchema = SCHEMA.service(gig, creator);
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Explore', item: '/explore' },
    { name: gig.category || 'Service', item: `/explore?cat=${gig.category}` },
    { name: gig.title, item: `/gig/${gig.id}` }
  ];
  const breadcrumbSchema = SCHEMA.breadcrumb(breadcrumbItems);

  const supabase = await createClient();
  const { data: relatedGigs } = await supabase
    .from('gigs')
    .select('*, creator:profiles(id, name, initials, cover_color, avatar_url)')
    .eq('category', gig.category)
    .neq('id', gig.id)
    .limit(4);

  const normalizedRelated = (relatedGigs || []).map((g: any) => ({
    ...g,
    creatorObj: { 
      name: g.creator?.name ?? 'Creator', 
      initials: g.creator?.initials ?? '??', 
      color: g.creator?.cover_color ?? 'var(--color-primary)',
      avatar_url: g.creator?.avatar_url
    }
  }));

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <GigDetailClient initialGig={gig} initialCreator={creator} />
      
      {/* Internal Linking: Related Gigs */}
      {normalizedRelated.length > 0 && (
        <section className="container mx-auto px-4 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold mb-10">More <span className="text-primary-light">{gig.category?.replace('-', ' ')}</span> Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {normalizedRelated.map(rg => (
              <GigCard key={rg.id} gig={rg} creator={rg.creatorObj} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
