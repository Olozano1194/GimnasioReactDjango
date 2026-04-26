const ACCESS_TOKEN_KEY = 'gym_access_token';

// Access token en sessionStorage (sobrevive a recargas, se borra al cerrar navegador)
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getRefreshTokenFromCookie = (): string | null => {
  const match = document.cookie.match(/refresh_token=([^;]+)/);
  return match ? match[1] : null;
};

export const clearRefreshCookie = (): void => {
  document.cookie = 'refresh_token=; Max-Age=0; Path=/gym/api/v1/token/refresh/';
};