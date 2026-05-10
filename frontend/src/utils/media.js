const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

export const getMediaUrl = (url) => {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `${apiOrigin}${url}`;
};
