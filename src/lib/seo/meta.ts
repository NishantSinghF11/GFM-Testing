import { Metadata } from 'next';
import { SEO_CONFIG } from './config';

interface MetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string; // This can be a full URL or just a path
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title,
  description = SEO_CONFIG.defaultDescription,
  keywords = [],
  image = SEO_CONFIG.ogImage,
  noIndex = false,
  canonical,
  type = 'website',
  publishedTime,
  authors,
}: MetaOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle;
  
  // Merge page-specific keywords with global brand keywords
  const allKeywords = [...new Set([...SEO_CONFIG.defaultKeywords, ...keywords])];

  // Extract path from canonical if it's a full URL
  let path = '';
  if (canonical) {
    if (canonical.startsWith('http')) {
      try {
        path = new URL(canonical).pathname;
      } catch (e) {
        path = canonical;
      }
    } else {
      path = canonical.startsWith('/') ? canonical : `/${canonical}`;
    }
  }
  
  // Ensure we don't have double slashes if path is '/'
  const cleanPath = path === '/' ? '' : path;

  return {
    title: title ? { default: fullTitle, template: SEO_CONFIG.titleTemplate } : SEO_CONFIG.defaultTitle,
    description,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : SEO_CONFIG.authors,
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.publisher,
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    alternates: {
      canonical: canonical || SEO_CONFIG.baseUrl,
      languages: {
        'en-US': `${SEO_CONFIG.baseUrl}${cleanPath}`,
        'en-IN': `${SEO_CONFIG.alternateUrl}${cleanPath}`,
        'x-default': `${SEO_CONFIG.baseUrl}${cleanPath}`,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || SEO_CONFIG.baseUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: SEO_CONFIG.locale,
      type: type as any,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: SEO_CONFIG.twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}
