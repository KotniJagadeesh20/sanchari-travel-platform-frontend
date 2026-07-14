import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import TripDetails from "./pages/TripDetails";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import AllPackages from "./pages/AllPackages";
import RealPackageDetails from "./pages/RealPackageDetails";
import MyPackageBookings from "./pages/MyPackageBookings";
import TroopsPage from "./pages/Troops";
import TroopDetails from "./pages/TroopDetails";
import CreateTroop from "./pages/CreateTroop";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Profile from "./pages/Profile";
import PlaceDetails from "./pages/PlaceDetails";
import PlannerLayout from "./components/planner/PlannerLayout";
import PlannerDashboard from "./pages/planner/PlannerDashboard";
import MyPackages from "./pages/planner/MyPackages";
import CreatePackage from "./pages/planner/CreatePackage";
import PlannerCreateService from "./pages/planner/CreateService";
import PlannerProfile from "./pages/planner/PlannerProfile";
import Orders from "./pages/planner/Orders";
import MyHotels from "./pages/planner/MyHotels";
import Bookings from "./pages/planner/Bookings";
import Analytics from "./pages/planner/Analytics";
import Reviews from "./pages/planner/Reviews";
import PlannerSettings from "./pages/planner/Settings";
import MyServices from "./pages/planner/MyServices";
import Transportation from "./pages/transportation/Transportation";
import BusSearch from "./pages/transportation/bus/BusSearch";
import BusResults from "./pages/transportation/bus/BusResults";
import BusSeatSelection from "./pages/transportation/bus/BusSeatSelection";
import BusBookings from "./pages/transportation/bus/BusBookings";
import RidesLanding from "./pages/transportation/rides/RidesLanding";
import RideSearch from "./pages/transportation/rides/RideSearch";
import RideDetails from "./pages/transportation/rides/RideDetails";
import OfferRide from "./pages/transportation/rides/OfferRide";
import MyRides from "./pages/transportation/rides/MyRides";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/Destinations";
import BusManagement from "./pages/admin/BusManagement";
import AdminUsers from "./pages/admin/AdminUsers";
import Moderation from "./pages/admin/Moderation";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import NotificationTemplates from "./pages/admin/NotificationTemplates";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/all-packages" element={<AllPackages />} />
          <Route path="/all-packages/:id" element={<RealPackageDetails />} />
          <Route
            path="/my-package-bookings"
            element={
              <ProtectedRoute>
                <MyPackageBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/packages/:tripId" element={<Packages />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/troops" element={<TroopsPage />} />
          <Route path="/troops/:id" element={<TroopDetails />} />
          <Route path="/create-troop" element={<CreateTroop />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/place/:tripId/:placeId" element={<PlaceDetails />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/transportation/bus" element={<BusSearch />} />
          <Route path="/transportation/bus/search" element={<BusResults />} />
          <Route path="/transportation/bus/bookings" element={<BusBookings />} />
          <Route path="/transportation/bus/:id" element={<BusSeatSelection />} />
          <Route path="/transportation/rides" element={<RidesLanding />} />
          <Route path="/transportation/rides/search" element={<RideSearch />} />
          <Route path="/transportation/rides/create" element={<OfferRide />} />
          <Route path="/transportation/rides/my-rides" element={<MyRides />} />
          <Route path="/transportation/rides/:id" element={<RideDetails />} />
          <Route
            path="/planner"
            element={
              // TEMPORARY: ROLE_PARTNER doesn't exist in the backend yet.
              // Gating on ROLE_ADMIN for now — swap back to ["ROLE_PARTNER"]
              // once auth-service adds the role + assignment flow.
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <PlannerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PlannerDashboard />} />
            <Route path="packages" element={<MyPackages />} />
            <Route path="create" element={<CreatePackage />} />
            {/* Troops hidden from Partner Dashboard for now — not part of Version 1 scope */}
            <Route path="services" element={<MyServices />} />
            <Route path="create-service" element={<PlannerCreateService />} />
            <Route path="hotels" element={<MyHotels />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<PlannerSettings />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<PlannerProfile />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="moderation" element={<Moderation />} />
            <Route path="analytics" element={<PlatformAnalytics />} />
            <Route path="templates" element={<NotificationTemplates />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
