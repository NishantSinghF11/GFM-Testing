import { SEO_CONFIG } from './config';
import { constructMetadata } from './meta';
import { getCanonicalUrl } from './canonical';

interface ProgrammaticSEOProps {
  keyword: string;
  location?: string;
  category?: string;
  type?: string;
}

export function generateProgrammaticMetadata({
  keyword,
  location,
  category,
  type = 'freelancers'
}: ProgrammaticSEOProps) {
  const locationText = location ? ` in ${location}` : '';
  const categoryText = category ? ` ${category}` : '';
  
  const title = `Hire the Best ${keyword}${categoryText}${locationText}`;
  const description = `Looking for ${keyword}${categoryText}${locationText}? GigsForMe connects you with top-rated ${keyword} experts for high-stakes creative projects. AI-vetted and secure.`;
  
  const path = `/hire/${keyword.toLowerCase().replace(/ /g, '-')}${location ? `-in-${location.toLowerCase().replace(/ /g, '-')}` : ''}`;

  return constructMetadata({
    title,
    description,
    canonical: getCanonicalUrl(path),
    keywords: [keyword, category, location, 'hire freelancers', 'creative services'].filter(Boolean) as string[],
  });
}

export function getProgrammaticPaths() {
  // This would usually fetch from a DB or list of target keywords
  return [
    { keyword: 'React Developers', location: 'India' },
    { keyword: 'Graphic Designers', category: 'Creative' },
    { keyword: 'Video Editors', location: 'Remote' },
  ];
}
