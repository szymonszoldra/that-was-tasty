export const menu = [
  { slug: '/restaurants', caption: 'Restaurants', icon: 'fa-utensils' },
  { slug: '/top', caption: 'Top', icon: 'fa-trophy' },
  { slug: '/tags', caption: 'Tags', icon: 'fa-tags' },
  { slug: '/add', caption: 'Add', icon: 'fa-plus' },
  { slug: '/map', caption: 'Map', icon: 'fa-map-marker-alt' },
];

export const restaurantOptions = [
  { caption: 'Add', action: 'add', icon: 'fa-plus' },
  { caption: 'Edit', action: 'edit', icon: 'fa-pen' },
  { caption: 'Delete', action: 'delete', icon: 'fa-trash' },
];

export const staticMap = (lng: number, lat: number): string => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=1280x300&key=${process.env.GOOGLE_KEY}&markers=size:tiny%7C${lat},${lng}&scale=2`;
