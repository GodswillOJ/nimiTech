const getBaseUrl = (): string => {
  return process.env.REACT_APP_API_BASE_URL || 'https://nimitech-website.onrender.com';
};

export const getApiBaseUrl = (): string => {
  const baseUrl = getBaseUrl();
  // Remove trailing slash if present to avoid double slashes
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}/api`;
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

  // For development, use localhost
  if (process.env.NODE_ENV === 'development') {
    const localServerUrl = 'http://localhost:10000';
    const fullUrl = `${localServerUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
    console.log('Dev Image URL:', fullUrl);
    return fullUrl;
  }

  // For production, ensure proper URL construction
  const fullUrl = `${serverUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  console.log('Prod Image URL:', fullUrl);
  return fullUrl;
};
