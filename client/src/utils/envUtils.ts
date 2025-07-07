const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:10000';
  }
  return 'https://nimitech-website.onrender.com';
};

export const getApiBaseUrl = (): string => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api`;
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
    return fullUrl;
  }

  const fullUrl = `${serverUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  return fullUrl;
};
