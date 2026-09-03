import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser, LoginPayload, RegisterPayload, UpdateProfilePayload } from "@/services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<AuthUser>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bootstrap from localStorage on first load — no network call needed,
    // we trust the stored profile until something 401s (api.ts handles
    // the refresh-or-clear dance transparently after that point).
    if (authService.isAuthenticated()) {
      setUser(authService.getStoredUser());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // api.ts dispatches this when a background token refresh fails (session
    // expired while the user was sitting on a page, not actively logging
    // in/out). Without this listener, `user` stays stale — isAuthenticated
    // would keep reporting true even though localStorage was already
    // cleared — until the user happened to navigate or reload.
    const handleSessionExpired = () => setUser(null);
    window.addEventListener("sanchari:session-expired", handleSessionExpired);
    return () => window.removeEventListener("sanchari:session-expired", handleSessionExpired);
  }, []);

  const login = async (payload: LoginPayload) => {
    const authUser = await authService.login(payload);
    setUser(authUser);
    return authUser;
  };

  const register = async (payload: RegisterPayload) => {
    const authUser = await authService.register(payload);
    setUser(authUser);
    return authUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const authUser = await authService.updateProfile(payload);
    setUser(authUser);
    return authUser;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
