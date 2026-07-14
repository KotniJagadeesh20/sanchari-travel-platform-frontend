import { authStorage } from "@/lib/auth-storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  /** Skip attaching the Authorization header (login/register/refresh don't need it). */
  skipAuth?: boolean;
  /** Internal — prevents infinite refresh loops. Do not set this yourself. */
  _isRetry?: boolean;
}

// Deduplicates concurrent refresh attempts: if five requests 401 at once,
// only one actual POST /auth/refresh-token call goes out.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.accessToken) return null;
        authStorage.setAccessToken(data.accessToken);
        if (data.refreshToken) authStorage.setRefreshToken(data.refreshToken);
        return data.accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Core fetch wrapper for every backend call. Attaches the bearer token,
 * transparently retries once via refresh-token on a 401, and normalizes
 * error responses into ApiError so callers can show `err.message` directly.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, _isRetry, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!skipAuth) {
    const token = authStorage.getAccessToken();
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  // Access token expired mid-session — refresh once and retry the same call.
  if (res.status === 401 && !skipAuth && !_isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, { ...options, _isRetry: true });
    }
    authStorage.clear();
    // Let the caller's UI react (e.g. redirect to /login) rather than forcing
    // a hard navigation from inside the fetch layer.
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = body?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return body as T;
}
