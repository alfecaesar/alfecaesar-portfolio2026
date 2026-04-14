export interface ProfileBadge {
  id: string;
  title: string;
  imageUrl: string;
  credlyUrl: string;
}

export const fallbackProfileBadges: ProfileBadge[] = [
  {
    id: 'shopify-development-fundamentals',
    title: 'Shopify Development Fundamentals: Verified Skill Badge',
    imageUrl: 'https://images.credly.com/size/340x340/images/placeholder.png',
    credlyUrl: 'https://www.credly.com/',
  },
];
