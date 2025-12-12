import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO date string to readable format
 * @example formatDate("2024-03-15T10:30:00") => "March 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * WordPress REST API Post type (mirrors the actual API response)
 */
export interface WPPost {
  id: number;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media?: string | null;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

/**
 * Extract featured image URL from WordPress post data
 * Returns null if no featured image exists
 */
export function getFeaturedImage(post: WPPost): string | null {
  // Check _embedded structure first (WordPress REST API format)
  const media = post._embedded?.['wp:featuredmedia'];
  if (media && media.length > 0 && media[0].source_url) {
    return media[0].source_url;
  }
  
  // Check featured_media string directly (Supabase stored format)
  if (typeof post.featured_media === 'string' && post.featured_media) {
    return post.featured_media;
  }
  
  return null;
}
