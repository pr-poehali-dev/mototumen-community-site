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
            <Route path="/profile" element={<Profile />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;