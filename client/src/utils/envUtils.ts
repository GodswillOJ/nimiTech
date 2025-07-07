const getBaseUrl = (): string => {
  return process.env.REACT_APP_API_BASE_URL || 'https://nimitech-website.onrender.com';
};

export const getApiBaseUrl = (): string => {
  const baseUrl = getBaseUrl();
  // Remove trailing slash if present to avoid double slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}`;
};

export const getServerBaseUrl = (): string => {
  const baseUrl = getBaseUrl();
  // Remove trailing slash for consistency
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const serverUrl = getServerBaseUrl();

  // For production, ensure proper URL construction
  const fullUrl = `${serverUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  return fullUrl;
};
