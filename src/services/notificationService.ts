import { apiFetch } from "@/lib/api";

export type NotificationType = "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | "BOOKING_REJECTED" | "REVIEW_POSTED" | "GENERIC";
export type EmailStatus = "NOT_REQUESTED" | "SENT" | "FAILED";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string | null;
  read: boolean;
  readAt: string | null;
  emailStatus: EmailStatus;
  createdAt: string; // ISO datetime
}

export const notificationService = {
  /** Newest first, includes both read and unread. */
  async getMyNotifications(): Promise<AppNotification[]> {
    return (await apiFetch<AppNotification[]>("/notifications/me")) || [];
  },

  async getUnreadCount(): Promise<number> {
    const result = await apiFetch<{ unreadCount: number }>("/notifications/me/unread-count");
    return result.unreadCount;
  },

  async markAsRead(notificationId: string): Promise<AppNotification> {
    return apiFetch<AppNotification>(`/notifications/${notificationId}/read`, { method: "PATCH" });
  },

  async markAllAsRead(): Promise<void> {
    await apiFetch("/notifications/read-all", { method: "PATCH" });
  },
};
