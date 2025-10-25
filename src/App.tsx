import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import TelegramAutoAuth from "@/components/auth/TelegramAutoAuth";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import Shop from "./pages/Shop";
import Schools from "./pages/Schools";
import Service from "./pages/Service";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import { UsersPage } from "./pages/UsersPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import Admin from "./pages/Admin";
import BecomeOrganization from "./pages/BecomeOrganization";
import OrganizationRegister from "./pages/OrganizationRegister";
import OrganizationSuccess from "./pages/OrganizationSuccess";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrganizationPage from "./pages/OrganizationPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <TelegramAutoAuth />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/service" element={<Service />} />
            <Route path="/ads" element={<Announcements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/user/:userId" element={<UserProfilePage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route path="/organization/:id" element={<OrganizationPage />} />
            <Route path="/become-organization" element={<BecomeOrganization />} />
            <Route path="/organization-register" element={<OrganizationRegister />} />
            <Route path="/organization-success" element={<OrganizationSuccess />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route
              path="/stores"
              element={
                <Stores
                  onStoreClick={(storeId) =>
                    (window.location.href = `/stores/${storeId}`)
                  }
                />
              }
            />
            <Route
              path="/stores/:storeId"
              element={
                <StoreDetail
                  storeId={window.location.pathname.split("/")[2] || ""}
                  onBack={() => (window.location.href = "/stores")}
                />
              }
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;