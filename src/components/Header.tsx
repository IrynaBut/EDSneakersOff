import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  Heart,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import Cart from "@/components/Cart";
import SearchDialog from "@/components/SearchDialog";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  
  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Homme", href: "/homme" },
    { name: "Femme", href: "/femme" },
    { name: "Enfant", href: "/enfant" },
    { name: "Nouveautés", href: "/nouveautes" },
    { name: "Promotions", href: "/promotions" },
  ];

  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="ED Sneakers" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary">EDSneakers</span>
              <p className="text-xs text-muted-foreground">Style & Qualité</p>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  isActive(item.href) 
                    ? "text-primary font-semibold" 
                    : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Greeting */}
            {user && userProfile && (
              <span className="text-sm text-muted-foreground">
                Bonjour, {userProfile.first_name || userProfile.email}
              </span>
            )}
            
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="relative">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link to="/favoris">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Link>
            </Button>
            <Cart />
            {user ? (
              <div className="flex items-center space-x-2">
                {(userProfile?.role === 'admin' || userProfile?.role === 'vendeur') ? (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/gestion">
                      <Settings className="h-4 w-4" />
                      <span className="ml-2 text-sm">Gestion</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4" />
                      <span className="ml-2 text-sm">Profil</span>
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 text-sm">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">
                  <User className="h-4 w-4" />
                  <span className="ml-2 text-sm">Connexion</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-secondary/50"
                      : "text-foreground/60 hover:text-accent hover:bg-secondary/30"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-around pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/favoris">
                    <Heart className="h-4 w-4" />
                  </Link>
                </Button>
                <Cart />
                {user ? (
                  <div className="flex items-center justify-center">
                    {(userProfile?.role === 'admin' || userProfile?.role === 'vendeur') ? (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/gestion">
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/profile">
                          <User className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">
                      <User className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;