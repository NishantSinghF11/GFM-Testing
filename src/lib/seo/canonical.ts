import { SEO_CONFIG } from './config';

export function getCanonicalUrl(path: string = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove query parameters for canonical unless necessary
  const pathWithoutQuery = normalizedPath.split('?')[0];
  // Remove trailing slash for consistency
  const finalPath = pathWithoutQuery === '/' ? '' : pathWithoutQuery.replace(/\/$/, "");
  
  return `${SEO_CONFIG.baseUrl}${finalPath}`;
}

export function getAbsoluteImageUrl(path: string): string {
  if (!path) return `${SEO_CONFIG.baseUrl}${SEO_CONFIG.ogImage}`;
  if (path.startsWith('http')) return path;
  return `${SEO_CONFIG.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
