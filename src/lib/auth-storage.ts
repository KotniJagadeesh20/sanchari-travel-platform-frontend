// Centralized localStorage access for auth state.
//
// NOTE ON SECURITY TRADEOFF: storing tokens in localStorage is vulnerable to
// XSS (any injected script can read them), unlike an HttpOnly cookie which
// JS can't touch at all. The backend's auth-service issues a bearer JWT
// designed to be sent as an `Authorization: Bearer <token>` header (not a
// cookie), so localStorage is the pragmatic choice given the current
// contract — revisit if the backend ever moves to HttpOnly cookie auth.

import type { AuthUser } from "@/services/authService";

const ACCESS_TOKEN_KEY = "sanchari_access_token";
const REFRESH_TOKEN_KEY = "sanchari_refresh_token";
const USER_KEY = "sanchari_user";

export const authStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  setSession(accessToken: string, refreshToken: string, user: AuthUser) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  setRefreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
