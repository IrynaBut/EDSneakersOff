import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CartProvider } from "./hooks/useCart";
import { FavoritesProvider } from "./hooks/useFavorites";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import TestAPI from "./pages/TestAPI";
import UserProfile from "./pages/UserProfile";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Management from "./pages/Management";
import FAQ from "./components/FAQ";
import RoleGuard from "./components/RoleGuard";
import LoadingSpinner from "./components/LoadingSpinner";
import CookieConsent from "./components/CookieConsent";
import FloatingButton from "./components/FloatingButton";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/homme" element={<Shop category="homme" />} />
          <Route path="/femme" element={<Shop category="femme" />} />
          <Route path="/enfant" element={<Shop category="enfant" />} />
          <Route path="/nouveautes" element={<Shop category="nouveautes" />} />
          <Route path="/promotions" element={<Shop category="promotions" />} />
          <Route path="/produits" element={<Shop />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/favoris" element={<Favorites />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/commandes" element={<Orders />} />
          <Route path="/gestion" element={<Management />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/mon-compte" element={
            <RoleGuard allowedRoles={['client']}>
              <UserProfile />
            </RoleGuard>
          } />
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['admin']}>
              <Management />
            </RoleGuard>
          } />
          <Route path="/vendeur" element={
            <RoleGuard allowedRoles={['vendeur']}>
              <Management />
            </RoleGuard>
          } />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/politique-cookies" element={<PolitiqueCookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Floating Support Button with Newsletter */}
      <FloatingButton />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
              <CookieConsent />
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;