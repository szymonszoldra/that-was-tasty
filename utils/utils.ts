export const menu = [
  { slug: '/restaurants', caption: 'Restaurants', icon: 'fa-utensils' },
  { slug: '/top', caption: 'Top', icon: 'fa-trophy' },
  { slug: '/tags', caption: 'Tags', icon: 'fa-tags' },
  { slug: '/add', caption: 'Add', icon: 'fa-plus' },
];

export const restaurantOptions = [
  { caption: 'Add', action: 'add-meal', icon: 'fa-plus' },
  { caption: 'Edit', action: 'edit', icon: 'fa-pen' },
  { caption: 'Delete', action: 'delete', icon: 'fa-trash' },
];

export const tags = [
  'Fast food', 'Sushi', 'Cafe', 'Cheap', 'Exclusive', 'Pizza', 'Oriental', 'Italian', 'Breakfast',
  'French', 'Burgers', 'Vegan', 'Pub'];
export const staticMap = (lng: number, lat: number): string => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=1280x300&key=${process.env.GOOGLE_KEY}&markers=size:tiny%7C${lat},${lng}&scale=2`;
