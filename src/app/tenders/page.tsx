import { Metadata } from 'next';
import { mockTenders } from '@/lib/tenders';
import TendersClient from './TendersClient';
import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import { SCHEMA } from '@/lib/seo/schema';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = constructMetadata({
  title: "Creative Tenders & Job Board",
  description: "Browse high-stakes creative projects and high-paying tenders. Use our AI-powered matching to find projects that fit your unique skills.",
  canonical: getCanonicalUrl('/tenders'),
});

export default function TendersFeedPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Tenders', item: '/tenders' }
  ];
  const breadcrumbSchema = SCHEMA.breadcrumb(breadcrumbItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <TendersClient initialTenders={mockTenders} />
    </>
  );
}
