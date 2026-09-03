import { apiFetch } from "@/lib/api";
import type { Role } from "@/services/authService";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  dob: string;
  role: Role;
}

export const adminUserService = {
  /**
   * No suspend/delete here — UserAdmin has no enabled/status field on the
   * backend at all (nothing to toggle), and there's no delete-user endpoint.
   * Adding either is a separate, more careful change since it touches the
   * login path for every user, not something to slip in as a side effect
   * of wiring up the list view.
   */
  async getAllUsers(): Promise<AdminUserRecord[]> {
    return (await apiFetch<AdminUserRecord[]>("/auth/users/admin")) || [];
  },
};
