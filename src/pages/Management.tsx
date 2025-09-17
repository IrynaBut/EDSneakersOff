import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { AdminPanel } from "@/components/AdminPanel";
import { VendorPanel } from "@/components/VendorPanel";
import { 
  Settings, 
  Users, 
  Package, 
  BarChart3, 
  ArrowLeft,
  Shield,
  Store
} from "lucide-react";

const Management = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Check if user has admin or vendor role
        if (data.role !== 'admin' && data.role !== 'vendeur') {
          navigate('/');
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const getGreetingName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || (profile.role !== 'admin' && profile.role !== 'vendeur')) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Accès Non Autorisé</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Gestion et Administration
              </h1>
              <p className="text-muted-foreground">
                {getGreetingName() && `Bonjour, ${getGreetingName()} - `}
                {profile.role === 'admin' ? 'Administrateur' : 'Vendeur'}
              </p>
            </div>
            <Badge 
              variant={profile.role === 'admin' ? 'default' : 'secondary'}
              className="px-3 py-1"
            >
              {profile.role === 'admin' ? (
                <>
                  <Shield className="w-4 h-4 mr-1" />
                  Administrateur
                </>
              ) : (
                <>
                  <Store className="w-4 h-4 mr-1" />
                  Vendeur
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {profile.role === 'admin' ? (
            <Tabs defaultValue="admin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Administration
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Statistiques
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <AdminPanel />
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Fonctionnalité de gestion des utilisateurs en développement...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques et Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Tableau de bord analytics en développement...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="vendor" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Gestion Stock
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Commandes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vendor">
                <VendorPanel />
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Suivi des Commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Interface de suivi des commandes détaillée en développement...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Management;