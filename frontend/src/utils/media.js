const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.jpg';

  if (url.startsWith('http')) {
    return url;
  }

  return `${API_URL}${url}`;
};

export const getMediaUrl = (url) => {
  return getImageUrl(url);
};

export default getImageUrl;