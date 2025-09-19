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
  MapPin,
  Edit3,
  Save,
  X
} from "lucide-react";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileResult = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileResult.error && profileResult.error.code !== 'PGRST116') throw profileResult.error;
        
        // Redirect admin/vendor users to management dashboard
        if (profileResult.data?.role === 'admin' || profileResult.data?.role === 'vendeur') {
          navigate('/gestion');
          return;
        }
        
        setProfile(profileResult.data || { email: user.email });
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
      const payload = {
        user_id: user?.id as string,
        email: (profile?.email || user?.email) as string,
        first_name: (formData.get('firstName') as string) || null,
        last_name: (formData.get('lastName') as string) || null,
        phone: (formData.get('phone') as string) || null,
        birth_date: (formData.get('birthDate') as string) || null,
        street_number: (formData.get('streetNumber') as string) || null,
        street_name: (formData.get('streetName') as string) || null,
        city: (formData.get('city') as string) || null,
        postal_code: (formData.get('postalCode') as string) || null
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .maybeSingle();

      if (error) throw error;

      setProfile(data || payload);

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès.',
      });
      setEditing(false);
      setFormKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour votre profil.",
        variant: 'destructive',
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
          <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Identity Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Identité
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Client</Badge>
                    {!editing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form key={`identity-${formKey}`} onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateProfile(formData);
                }} className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        defaultValue={profile?.first_name || ''} 
                        disabled={!editing}
                        placeholder="Votre prénom"
                        className={!editing ? "bg-muted" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">Nom de famille</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        defaultValue={profile?.last_name || ''} 
                        disabled={!editing}
                        placeholder="Votre nom"
                        className={!editing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthDate" className="text-sm font-medium">Date de naissance</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="birthDate" 
                        name="birthDate"
                        type="date"
                        defaultValue={profile?.birth_date || ''} 
                        disabled={!editing}
                        className={!editing ? "bg-muted flex-1" : "flex-1"}
                      />
                    </div>
                  </div>

                  {editing && (
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Annuler
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Adresse email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={profile?.email || user?.email || ''} 
                      disabled 
                      className="bg-muted flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    L'adresse email ne peut pas être modifiée
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone"
                      defaultValue={profile?.phone || ''} 
                      disabled={!editing}
                      placeholder="Votre numéro de téléphone"
                      className={!editing ? "bg-muted flex-1" : "flex-1"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="streetNumber" className="text-sm font-medium">Numéro</Label>
                    <Input 
                      id="streetNumber" 
                      name="streetNumber"
                      placeholder="123"
                      defaultValue={profile?.street_number || ''} 
                      disabled={!editing}
                      className={!editing ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="streetName" className="text-sm font-medium">Nom de la rue</Label>
                    <Input 
                      id="streetName" 
                      name="streetName"
                      placeholder="rue de la Paix"
                      defaultValue={profile?.street_name || ''} 
                      disabled={!editing}
                      className={!editing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">Ville</Label>
                    <Input 
                      id="city" 
                      name="city"
                      placeholder="Paris"
                      defaultValue={profile?.city || ''} 
                      disabled={!editing}
                      className={!editing ? "bg-muted" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-sm font-medium">Code postal</Label>
                    <Input 
                      id="postalCode" 
                      name="postalCode"
                      placeholder="75001"
                      defaultValue={profile?.postal_code || ''} 
                      disabled={!editing}
                      className={!editing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
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
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={signOut}>
                  Se déconnecter
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleDeleteAccount}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Supprimer mon compte
                </Button>
                <p className="text-xs text-muted-foreground">
                  Cette action est irréversible et supprimera définitivement toutes vos données.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;