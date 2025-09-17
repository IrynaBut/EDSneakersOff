import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites from localStorage for non-authenticated users
  useEffect(() => {
    if (!user) {
      const localFavorites = localStorage.getItem('favorites');
      setFavorites(localFavorites ? JSON.parse(localFavorites) : []);
      setLoading(false);
    }
  }, [user]);

  // Load favorites from database for authenticated users
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;

      try {
        // For now, we'll use localStorage even for authenticated users
        // In a full implementation, you'd create a favorites table in Supabase
        const localFavorites = localStorage.getItem(`favorites_${user.id}`);
        setFavorites(localFavorites ? JSON.parse(localFavorites) : []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user]);

  const saveFavorites = (newFavorites: string[]) => {
    const key = user ? `favorites_${user.id}` : 'favorites';
    localStorage.setItem(key, JSON.stringify(newFavorites));
  };

  const addToFavorites = async (productId: string) => {
    try {
      const newFavorites = [...favorites, productId];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
      
      toast({
        title: "Ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris",
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const newFavorites = favorites.filter(id => id !== productId);
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
      
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris",
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive"
      });
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};