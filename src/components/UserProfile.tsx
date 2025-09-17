import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, ShoppingBag, Users, Package, BarChart3, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { getUserPoints } = useLoyaltyPoints();
  const { getOrders } = useOrders();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Charger le profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Charger les points de fidélité pour les clients
      if (profileData?.role === 'client') {
        const { points } = await getUserPoints();
        setLoyaltyPoints(points);
      }

      // Charger les commandes
      const { orders: userOrders } = await getOrders();
      setOrders(userOrders || []);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erreur lors du chargement des données utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      if (error) throw error;
      
      toast.success('Profil supprimé avec succès');
      signOut();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Erreur lors de la suppression du profil');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!profile) {
    return <div>Profil non trouvé</div>;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'vendeur': return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'client': return <Users className="h-5 w-5 text-green-500" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'vendeur': return 'Vendeur';
      case 'client': return 'Client';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {getRoleIcon(profile.role)}
          <div>
            <h1 className="text-2xl font-bold">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {getRoleName(profile.role)}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          {profile.role === 'client' && <TabsTrigger value="loyalty">Fidélité</TabsTrigger>}
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.role === 'client' && loyaltyPoints && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points de Fidélité</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loyaltyPoints.points}</div>
                  <p className="text-xs text-muted-foreground">
                    Total gagné: {loyaltyPoints.total_earned}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes Totales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">
                  En cours: {orders.filter(o => o.status === 'pending').length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rôle</CardTitle>
                {getRoleIcon(profile.role)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getRoleName(profile.role)}</div>
                <p className="text-xs text-muted-foreground">
                  {profile.role === 'admin' && 'Accès complet au système'}
                  {profile.role === 'vendeur' && 'Gestion stocks & commandes'}
                  {profile.role === 'client' && 'Espace personnel'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {profile.role === 'client' && (
          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle>Programme de Fidélité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loyaltyPoints ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{loyaltyPoints.points}</div>
                      <div className="text-sm text-muted-foreground">Points disponibles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{loyaltyPoints.total_earned}</div>
                      <div className="text-sm text-muted-foreground">Total gagné</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{loyaltyPoints.total_spent}</div>
                      <div className="text-sm text-muted-foreground">Total dépensé</div>
                    </div>
                  </div>
                ) : (
                  <p>Aucun point de fidélité disponible</p>
                )}
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Comment gagner des points ?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 1 point par euro dépensé</li>
                    <li>• Points attribués à la validation de commande</li>
                    <li>• Utilisez vos points pour des réductions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mes Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">#{order.order_number}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{order.total_amount}€</div>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucune commande trouvée</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Informations personnelles</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {profile.email}</div>
                  <div><strong>Prénom:</strong> {profile.first_name || 'Non renseigné'}</div>
                  <div><strong>Nom:</strong> {profile.last_name || 'Non renseigné'}</div>
                  <div><strong>Rôle:</strong> {getRoleName(profile.role)}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-red-600">Zone de danger</h4>
                {profile.role === 'client' && (
                  <Button 
                    variant="destructive" 
                    onClick={deleteProfile}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer mon profil</span>
                  </Button>
                )}
                {profile.role !== 'client' && (
                  <p className="text-sm text-muted-foreground">
                    Les comptes administrateur et vendeur ne peuvent pas être supprimés via l'interface utilisateur.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};