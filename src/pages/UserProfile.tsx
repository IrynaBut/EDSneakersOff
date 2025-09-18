import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { useFavorites } from "@/hooks/useFavorites";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Package,
  Heart,
  Settings,
  ArrowLeft,
  AlertTriangle,
  Star
} from "lucide-react";
import { NewsletterModal } from "@/components/NewsletterModal";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getUserPoints } = useLoyaltyPoints();
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<any>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newsletterModal, setNewsletterModal] = useState<{ open: boolean; type: 'subscribe' | 'unsubscribe' } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const [profileResult, loyaltyResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          getUserPoints()
        ]);

        if (profileResult.error) throw profileResult.error;
        
        // Redirect admin/vendor users to management dashboard
        if (profileResult.data.role === 'admin' || profileResult.data.role === 'vendeur') {
          navigate('/gestion');
          return;
        }
        
        setProfile(profileResult.data);
        
        if (loyaltyResult.points) {
          setLoyaltyPoints(loyaltyResult.points);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const wasSubscribed = profile?.newsletter_subscribed;
      const isNowSubscribed = formData.get('newsletter') === 'on';
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.get('firstName') as string,
          last_name: formData.get('lastName') as string,
          phone: formData.get('phone') as string,
          birth_date: formData.get('birthDate') as string,
          street_number: formData.get('streetNumber') as string,
          street_name: formData.get('streetName') as string,
          city: formData.get('city') as string,
          postal_code: formData.get('postalCode') as string,
          newsletter_subscribed: isNowSubscribed
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      // Handle newsletter subscription changes
      if (!wasSubscribed && isNowSubscribed) {
        setNewsletterModal({ open: true, type: 'subscribe' });
      } else if (wasSubscribed && !isNowSubscribed) {
        setNewsletterModal({ open: true, type: 'unsubscribe' });
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      setEditing(false);
      // Reload profile
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      `⚠️ ATTENTION : Cette action est IRRÉVERSIBLE\n\n` +
      `Êtes-vous absolument sûr de vouloir supprimer définitivement votre compte ?\n\n` +
      `Cela entraînera :\n` +
      `• La suppression de toutes vos données personnelles\n` +
      `• La perte de votre historique de commandes\n` +
      `• La suppression de vos points de fidélité\n` +
      `• La désactivation de votre accès au site\n\n` +
      `Cliquez OK pour confirmer la suppression définitive.`
    );
    
    if (!confirmed) {
      toast({
        title: "Suppression annulée",
        description: "Votre compte n'a pas été supprimé.",
      });
      return;
    }

    try {
      // Delete related data first
      await supabase.from('cart').delete().eq('user_id', user?.id);
      await supabase.from('loyalty_points').delete().eq('user_id', user?.id);
      
      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // Sign out user
      await signOut();
      
      toast({
        title: "Compte supprimé définitivement",
        description: "Votre compte et toutes vos données ont été supprimés avec succès.",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression",
        description: "Impossible de supprimer votre compte. Veuillez contacter le support.",
        variant: "destructive"
      });
    }
  };

  const getGreetingName = () => {
    if (user?.email === 'but.iryna@gmail.com') {
      return 'Iryna';
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {getGreetingName() ? `Bonjour, ${getGreetingName()}` : 'Mon Profil'}
          </h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles, vos commandes et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations personnelles
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Client
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateProfile(formData);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        defaultValue={profile?.first_name || ''} 
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        defaultValue={profile?.last_name || ''} 
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={profile?.email || ''} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      defaultValue={profile?.phone || ''} 
                      disabled={!editing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input 
                      id="birthDate" 
                      name="birthDate"
                      type="date"
                      defaultValue={profile?.birth_date || ''} 
                      disabled={!editing}
                    />
                  </div>

                   <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="streetNumber">Numéro</Label>
                         <Input 
                           id="streetNumber" 
                           name="streetNumber"
                           placeholder="123"
                           defaultValue={profile?.street_number || ''} 
                           disabled={!editing}
                         />
                       </div>
                       <div>
                         <Label htmlFor="streetName">Rue</Label>
                         <Input 
                           id="streetName" 
                           name="streetName"
                           placeholder="rue de la Paix"
                           list="streets"
                           defaultValue={profile?.street_name || ''} 
                           disabled={!editing}
                         />
                         <datalist id="streets">
                           <option value="rue de la Paix" />
                           <option value="avenue des Champs-Élysées" />
                           <option value="boulevard Saint-Germain" />
                           <option value="rue de Rivoli" />
                           <option value="place de la République" />
                           <option value="avenue de la République" />
                           <option value="rue Victor Hugo" />
                           <option value="place du Marché" />
                         </datalist>
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="city">Ville</Label>
                         <Input 
                           id="city" 
                           name="city"
                           placeholder="Paris"
                           list="cities"
                           defaultValue={profile?.city || ''} 
                           disabled={!editing}
                         />
                         <datalist id="cities">
                           <option value="Paris" />
                           <option value="Lyon" />
                           <option value="Marseille" />
                           <option value="Toulouse" />
                           <option value="Nice" />
                           <option value="Nantes" />
                           <option value="Montpellier" />
                           <option value="Strasbourg" />
                         </datalist>
                       </div>
                       <div>
                         <Label htmlFor="postalCode">Code postal</Label>
                         <Input 
                           id="postalCode" 
                           name="postalCode"
                           placeholder="75001"
                           defaultValue={profile?.postal_code || ''} 
                           disabled={!editing}
                         />
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center space-x-2">
                     <input 
                       type="checkbox" 
                       id="newsletter" 
                       name="newsletter"
                       defaultChecked={profile?.newsletter_subscribed || false}
                       disabled={!editing}
                       className="rounded border-border"
                     />
                     <Label htmlFor="newsletter" className="text-sm">
                       Abonné(e) à la newsletter
                     </Label>
                   </div>

                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button type="submit">
                          Sauvegarder
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                          Annuler
                        </Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setEditing(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Points de fidélité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold">
                      {loyaltyPoints?.points || 0} points
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total gagné : {loyaltyPoints?.total_earned || 0} points
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/commandes">
                    <Package className="w-4 h-4 mr-2" />
                    Mes commandes
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/favoris">
                    <Heart className="w-4 h-4 mr-2" />
                    Mes favoris ({favorites.length})
                  </a>
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDeleteAccount}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Supprimer mon profil
                </Button>
                <Button variant="outline" className="w-full" onClick={signOut}>
                  Déconnexion
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      
      {/* Newsletter Modal */}
      {newsletterModal && (
        <NewsletterModal
          open={newsletterModal.open}
          onOpenChange={() => setNewsletterModal(null)}
          type={newsletterModal.type}
          userEmail={profile?.email}
        />
      )}
    </div>
  );
};

export default UserProfile;