import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockTenders, mockBids } from '@/lib/tenders';
import TenderDetailClient from './TenderDetailClient';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { SCHEMA } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface TenderPageProps {
  params: Promise<{ id: string }>;
}

async function getTenderData(id: string) {
  const tender = mockTenders.find(t => t.id === id);
  const bids = mockBids.filter(b => b.tender_id === id);
  return { tender, bids };
}

export async function generateMetadata({ params }: TenderPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { tender } = await getTenderData(resolvedParams.id);

  if (!tender) return constructMetadata({ title: 'Tender Not Found' });

  return constructMetadata({
    title: tender.title,
    description: tender.description?.substring(0, 160),
    canonical: getCanonicalUrl(`/tenders/${tender.id}`),
    type: 'article',
  });
}

export default async function TenderDetailPage({ params }: TenderPageProps) {
  const resolvedParams = await params;
  const { tender, bids } = await getTenderData(resolvedParams.id);

  if (!tender) notFound();

  const jobSchema = SCHEMA.jobPosting(tender);
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Tenders', item: '/tenders' },
    { name: tender.title, item: `/tenders/${tender.id}` }
  ];
  const breadcrumbSchema = SCHEMA.breadcrumb(breadcrumbItems);

  return (
    <>
      <JsonLd data={jobSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <TenderDetailClient tender={tender} bids={bids} />
    </>
  );
}
