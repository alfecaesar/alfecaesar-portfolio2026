export interface PortfolioItem {
  id: string;
  title: string;
  siteUrl: string;
  thumbnailUrl: string;
  tools: string[];
}

export const fallbackPortfolioItems: PortfolioItem[] = [
  {
    id: 'shopify-plus-storefront',
    title: 'Shopify Plus Storefront',
    siteUrl: 'https://example.com/shopify-plus-storefront',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tools: ['Shopify', 'Liquid', 'GraphQL'],
  },
  {
    id: 'wordpress-headless-site',
    title: 'WordPress Headless Site',
    siteUrl: 'https://example.com/wordpress-headless-site',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
    tools: ['WordPress', 'REST API', 'React'],
  },
  {
    id: 'marketing-landing-page',
    title: 'Marketing Landing Page',
    siteUrl: 'https://example.com/marketing-landing-page',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
    tools: ['Tailwind CSS', 'JavaScript', 'Vite'],
  },
];
