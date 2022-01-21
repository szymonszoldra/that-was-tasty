export const menu = [
  { slug: '/', caption: 'Home', icon: 'logo.png' },
  { slug: '/restaurants', caption: 'Restaurants', icon: 'restaurants.png' },
  { slug: '/top', caption: 'Top', icon: 'podium.png' },
  { slug: '/tags', caption: 'Tags', icon: 'tags.png' },
  { slug: '/add', caption: 'Add', icon: 'add.png' },
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
