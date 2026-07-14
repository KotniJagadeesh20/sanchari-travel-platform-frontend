import { apiFetch } from "@/lib/api";
import {
  mapBackendBusToAdminBus, mapAdminBusToBackendPayload,
  mapBackendDriverToAdminDriver, mapAdminDriverToBackendPayload,
  type BackendBus, type BackendDriver,
} from "@/lib/bus-mappers";
import type { AdminBus, AdminDriver } from "@/data/admin";

interface BusListResponse { success: boolean; message?: string; busses: BackendBus[] | null; }
interface BusActionResponse { success: boolean; message: string; }
interface DriverListResponse { success: boolean; message?: string; drivers: BackendDriver[] | null; }
interface DriverActionResponse { success: boolean; message: string; driver?: BackendDriver; }

export const adminBusService = {
  // ─── Buses ──────────────────────────────────────────────────────────────

  async listBuses(existingById?: Map<string, AdminBus>): Promise<AdminBus[]> {
    const res = await apiFetch<BusListResponse>("/admin/allbusses");
    return (res.busses || []).map((b) => mapBackendBusToAdminBus(b, existingById?.get(b.id)));
  },

  async addBus(bus: {
    busno: string; source: string; destination: string; busType: string;
    date: string; departure: string; arrival?: string; arrivalDate?: string; price: number;
  }): Promise<void> {
    const res = await apiFetch<BusActionResponse>("/admin/addbus", {
      method: "POST",
      body: JSON.stringify(mapAdminBusToBackendPayload(bus)),
    });
    if (!res.success) throw new Error(res.message || "Failed to add bus");
  },

  /**
   * ⚠️ Backend bug workaround: bus-booking-service's editBus handler calls
   * `busRepo.save(bus)` directly on the incoming request body instead of
   * merging onto the entity it already fetched. Without `id`, Hibernate
   * treats the request as a new row and the INSERT fails on busno's unique
   * constraint. Passing the existing row's `id` here makes it correctly
   * UPDATE instead. The real fix belongs on the backend
   * (BusServiceImpl.Editbus should copy fields onto the fetched `isBus`
   * entity and save that, not the raw request body).
   */
  async editBus(bus: {
    id: string; busno: string; source: string; destination: string; busType: string;
    date: string; departure: string; arrival?: string; arrivalDate?: string; price: number;
  }): Promise<void> {
    const res = await apiFetch<BusActionResponse>("/admin/editBus", {
      method: "POST",
      body: JSON.stringify(mapAdminBusToBackendPayload(bus)),
    });
    if (!res.success) throw new Error(res.message || "Failed to update bus");
  },

  async deleteBus(busno: string): Promise<void> {
    const res = await apiFetch<BusActionResponse>(`/admin/deletebus/${encodeURIComponent(busno)}`, {
      method: "DELETE",
    });
    if (!res.success) throw new Error(res.message || "Failed to delete bus");
  },

  // ─── Drivers ────────────────────────────────────────────────────────────

  async listDrivers(existingById?: Map<string, AdminDriver>): Promise<AdminDriver[]> {
    const res = await apiFetch<DriverListResponse>("/admin/alldrivers");
    return (res.drivers || []).map((d) => mapBackendDriverToAdminDriver(d, existingById?.get(d.id)));
  },

  async addDriver(driver: { name: string; email: string; age: number; phone: string }): Promise<void> {
    const res = await apiFetch<DriverActionResponse>("/admin/addDriver", {
      method: "POST",
      body: JSON.stringify(mapAdminDriverToBackendPayload(driver)),
    });
    if (!res.success) throw new Error(res.message || "Failed to add driver");
  },

  /** Backend's editDriver looks the driver up by `id`, so it must be included. */
  async editDriver(driver: { id: string; name: string; email: string; age: number; phone: string }): Promise<void> {
    const res = await apiFetch<DriverActionResponse>("/admin/editDriver", {
      method: "POST",
      body: JSON.stringify({ id: driver.id, ...mapAdminDriverToBackendPayload(driver) }),
    });
    if (!res.success) throw new Error(res.message || "Failed to update driver");
  },

  async deleteDriver(id: string): Promise<void> {
    const res = await apiFetch<DriverActionResponse>(`/admin/deletedriver/${id}`, { method: "DELETE" });
    if (!res.success) throw new Error(res.message || "Failed to delete driver");
  },

  async assignDriver(busId: string, driverId: string): Promise<void> {
    const res = await apiFetch<DriverActionResponse>(`/admin/assignDriver/${busId}/${driverId}`, {
      method: "POST",
    });
    if (!res.success) throw new Error(res.message || "Failed to assign driver");
  },
};
