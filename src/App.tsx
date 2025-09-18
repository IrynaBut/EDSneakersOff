import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                    <Route path="/faq" element={<FAQ />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;