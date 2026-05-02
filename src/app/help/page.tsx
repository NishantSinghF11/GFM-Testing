import { constructMetadata } from '@/lib/seo/meta';
import { getCanonicalUrl } from '@/lib/seo/canonical';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import HelpClient from './HelpClient';

export const metadata = constructMetadata({
  title: "Help Center | Support & Resources",
  description: "Get help with GigsForMe. Learn about payments, escrow, account security, and trust and safety guidelines.",
  canonical: getCanonicalUrl('/help'),
});

export default function HelpPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Help Center', item: '/help' }
  ];

  return (
    <>
      <div className="container mx-auto px-4 pt-32">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <HelpClient />
    </>
  );
}
