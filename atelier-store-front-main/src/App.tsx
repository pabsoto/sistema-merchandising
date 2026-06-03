import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";


const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Artists = lazy(() => import("@/pages/Artists"));
const Merch = lazy(() => import("@/pages/Merch"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const ArtistDetail = lazy(() => import("@/pages/ArtistDetail"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard")); 
import ProtectedAdminRoute from "@/routes/ProtectedAdminRoute"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Suspense
              fallback={
                <div className="text-white p-8 text-center">Cargando...</div>
              }
            >
              <Routes>
                {/* Página principal */}
                <Route path="/" element={<Index />} />

                {/* Autenticación */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Secciones */}
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistDetail />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/community/:id" element={<CommunityPage />} />
                <Route path="/merch/:id" element={<ProductDetail />} />
                {/* Ruta protegida para admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Página no encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

            {/* Notificaciones */}
            <ShadcnToaster />
            <SonnerToaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
