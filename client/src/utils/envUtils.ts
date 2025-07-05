
const getBaseUrl = (): string => {
  const environment = process.env.REACT_APP_ENVIRONMENT || 'development';

  if (environment === 'production') {
    return process.env.REACT_APP_API_BASE_URL || 'https://api.nimitech.com';
  }

  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:10000';
};

export const getApiBaseUrl = (): string => {
  return `${getBaseUrl()}/api`;
};


export const getServerBaseUrl = (): string => {
  return getBaseUrl();
};


export const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const serverUrl = getServerBaseUrl();
  return `${serverUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};
