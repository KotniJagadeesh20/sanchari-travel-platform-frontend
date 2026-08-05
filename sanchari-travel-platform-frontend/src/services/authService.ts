import { apiFetch } from "@/lib/api";
import { authStorage } from "@/lib/auth-storage";

// "ROLE_PARTNER" does not exist in the backend's Role enum yet (only
// ROLE_USER/ROLE_ADMIN are real today) — included here for forward
// compatibility with the V1 roadmap, but no user can actually hold it
// until auth-service adds it + an admin role-assignment endpoint.
export type Role = "ROLE_USER" | "ROLE_PARTNER" | "ROLE_ADMIN";

// Mirrors auth-service's UserProfileResponse exactly — never contains
// password or any credential data, per that DTO's contract.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  dob: string; // ISO date
  role: Role;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string; // "YYYY-MM-DD"
  gender: string;
  age: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Raw shape of auth-service's UserAdminResponse (used by both /userRegister and /Loginin).
interface AuthResponseBody {
  success: boolean;
  message: string;
  jwt: string;
  refreshToken: string;
  userAdmin: AuthUser;
}

interface RefreshResponseBody {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

function persistSession(body: AuthResponseBody): AuthUser {
  authStorage.setSession(body.jwt, body.refreshToken, body.userAdmin);
  return body.userAdmin;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthUser> {
    const body = await apiFetch<AuthResponseBody>("/auth/userRegister", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(payload),
    });
    return persistSession(body);
  },

  async login(payload: LoginPayload): Promise<AuthUser> {
    const body = await apiFetch<AuthResponseBody>("/auth/Loginin", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify(payload),
    });
    return persistSession(body);
  },

  async refresh(): Promise<string | null> {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const body = await apiFetch<RefreshResponseBody>("/auth/refresh-token", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ refreshToken }),
      });
      authStorage.setAccessToken(body.accessToken);
      authStorage.setRefreshToken(body.refreshToken);
      return body.accessToken;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      // Best-effort — even if this call fails (token already expired, network
      // blip), we still clear local state below so the UI logs the user out.
      await apiFetch("/auth/logout", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    authStorage.clear();
  },

  getStoredUser(): AuthUser | null {
    return authStorage.getUser();
  },

  isAuthenticated(): boolean {
    return !!authStorage.getAccessToken();
  },
};
