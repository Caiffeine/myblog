import type { WPPost } from '../lib/utils';

/**
 * Mock posts data following WordPress REST API schema
 * This structure mirrors the actual WP REST API response
 * so it can be swapped for a fetch() call later
 */
export const mockPosts: WPPost[] = [
  {
    id: 1,
    date: '2024-12-10T14:30:00',
    title: { rendered: 'The Art of Slow Living' },
    excerpt: {
      rendered:
        '<p>In a world obsessed with speed and productivity, discovering the beauty in stillness has become a radical act of self-preservation.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 2,
    date: '2024-12-05T09:15:00',
    title: { rendered: 'Notes on Typography' },
    excerpt: {
      rendered:
        '<p>Letters are more than symbols—they are the silent architecture of thought, shaping how we perceive and understand the written word.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 3,
    date: '2024-11-28T16:45:00',
    title: { rendered: 'Morning Rituals & Coffee' },
    excerpt: {
      rendered:
        '<p>The first hour of the day sets the tone for everything that follows. A meditation on the sacred ritual of morning coffee.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 4,
    date: '2024-11-20T11:00:00',
    title: { rendered: 'The Texture of Paper' },
    excerpt: {
      rendered:
        '<p>There is something irreplaceable about the tactile experience of paper—its weight, its grain, the way ink settles into its fibers.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 5,
    date: '2024-11-15T08:30:00',
    title: { rendered: 'Wandering Through Old Bookshops' },
    excerpt: {
      rendered:
        '<p>Every dusty shelf holds a universe of forgotten stories, waiting for the right reader to bring them back to life.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        },
      ],
    },
  },
  {
    id: 6,
    date: '2024-11-08T13:20:00',
    title: { rendered: 'On Silence and Solitude' },
    excerpt: {
      rendered:
        '<p>In the absence of noise, we discover the most profound conversations—the ones we have with ourselves.</p>',
    },
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
        },
      ],
    },
  },
];
