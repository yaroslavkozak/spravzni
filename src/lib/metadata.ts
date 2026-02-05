/**
 * SEO Metadata configuration
 * Utility for generating metadata for TanStack Router
 * Update these values based on your project requirements
 */

export interface SiteMetadata {
  title: string;
  titleTemplate?: string;
  description: string;
  keywords: string[];
  siteUrl: string;
  ogImage?: string;
  twitterHandle?: string;
}

export const siteConfig: SiteMetadata = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  title: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну',
  titleTemplate: '%s | Центр відновлення Справжні',
  description: 'Центр відновлення Справжні - Вдихни тишу, Видихни війну. Професійна допомога в реабілітації та відновленні після травм та стресів.',
  keywords: ['центр відновлення', 'реабілітація', 'відновлення', 'справжні', 'психологічна допомога', 'реабілітаційний центр', 'Україна'],
  ogImage: '/og-image.jpg',
  twitterHandle: '@spravzni',
}

/**
 * Generate meta tags for TanStack Router
 */
export function generateMetaTags(overrides?: Partial<SiteMetadata>) {
  const config = { ...siteConfig, ...overrides };
  
  return [
    { charSet: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'description',
      content: config.description,
    },
    {
      name: 'keywords',
      content: config.keywords.join(', '),
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:locale',
      content: 'uk_UA',
    },
    {
      property: 'og:url',
      content: config.siteUrl,
    },
    {
      property: 'og:site_name',
      content: 'Центр відновлення Справжні',
    },
    {
      property: 'og:title',
      content: config.title,
    },
    {
      property: 'og:description',
      content: config.description,
    },
    ...(config.ogImage ? [{
      property: 'og:image',
      content: config.ogImage,
    }] : []),
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: config.title,
    },
    {
      name: 'twitter:description',
      content: config.description,
    },
    ...(config.ogImage ? [{
      name: 'twitter:image',
      content: config.ogImage,
    }] : []),
    ...(config.twitterHandle ? [{
      name: 'twitter:creator',
      content: config.twitterHandle,
    }] : []),
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'googlebot',
      content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1',
    },
    { title: config.title },
  ];
}
