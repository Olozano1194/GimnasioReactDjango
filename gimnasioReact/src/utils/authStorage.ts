let accessToken: string | null = null;

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};

export const getRefreshTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/refresh_token=([^;]+)/);
  return match ? match[1] : null;
};

export const clearRefreshCookie = (): void => {
  document.cookie = 'refresh_token=; Max-Age=0; Path=/gym/api/v1/token/refresh/';
};