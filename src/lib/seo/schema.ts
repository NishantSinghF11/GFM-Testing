import { SEO_CONFIG } from './config';

export const SCHEMA = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.baseUrl,
    "logo": `${SEO_CONFIG.baseUrl}/logo.png`,
    "sameAs": [
      `https://twitter.com/${SEO_CONFIG.twitterHandle.replace('@', '')}`,
      "https://www.linkedin.com/company/gigsforme",
      "https://www.facebook.com/gigsforme"
    ]
  }),

  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONFIG.siteName,
    "url": SEO_CONFIG.baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SEO_CONFIG.baseUrl}/explore?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }),

  breadcrumb: (items: { name: string; item: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith('http') ? item.item : `${SEO_CONFIG.baseUrl}${item.item}`
    }))
  }),

  service: (gig: any, creator: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": gig.category,
    "name": gig.title,
    "description": gig.description,
    "provider": {
      "@type": "Person",
      "name": creator.name,
      "url": `${SEO_CONFIG.baseUrl}/profile/${creator.id}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": gig.rating || 5,
      "reviewCount": gig.reviews_count || 0
    },
    "offers": {
      "@type": "Offer",
      "price": gig.price_basic,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }),

  person: (profile: any) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "description": profile.bio,
    "image": profile.avatar_url,
    "url": `${SEO_CONFIG.baseUrl}/profile/${profile.id}`,
    "jobTitle": profile.role || "Creative Professional",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location || "Online"
    },
    "sameAs": [
      profile.website,
      profile.twitter ? `https://twitter.com/${profile.twitter}` : null,
      profile.instagram ? `https://instagram.com/${profile.instagram}` : null,
      profile.youtube
    ].filter(Boolean)
  }),

  jobPosting: (tender: any) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": tender.title,
    "description": tender.description,
    "datePosted": tender.created_at,
    "validThrough": tender.deadline,
    "employmentType": "CONTRACTOR",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "GigsForMe Client",
      "logo": `${SEO_CONFIG.baseUrl}/logo.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Remote"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": tender.budget_min,
        "unitText": "TOTAL"
      }
    }
  }),

  faq: (questions: { q: string; a: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  })
};
