import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Heart, ArrowRight, Mail, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!orderNumber) {
    useEffect(() => {
      navigate('/');
      toast.error('Aucune commande trouvée');
    }, [navigate]);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Card className="border-none shadow-strong bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Icône de succès animée */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8">
                <Sparkles className="w-6 h-6 text-accent animate-spin" />
              </div>
            </div>

            {/* Message principal */}
            <div className="mb-8">
              <h1 className="text-4xl font-avallon text-primary mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Merci pour votre achat !
              </h1>
              <div className="w-24 h-1 bg-gradient-accent mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-muted-foreground mb-2">
                Votre commande <span className="font-semibold text-accent">#{orderNumber}</span> a été confirmée avec succès
              </p>
            </div>

            {/* Confirmation et email */}
            <Card className="mb-8 border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-semibold text-primary">Confirmation envoyée</h3>
                </div>
                <p className="text-muted-foreground">
                  Un email récapitulatif détaillé de votre commande vient d'être envoyé à votre adresse.
                  Vous y trouverez toutes les informations nécessaires pour le suivi de votre livraison.
                </p>
              </CardContent>
            </Card>

            {/* Prochaines étapes */}
            <div className="mb-8 space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Prochaines étapes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
                  <p className="text-muted-foreground">Traitement de votre commande sous 24h</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
                  <p className="text-muted-foreground">Préparation et expédition</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
                  <p className="text-muted-foreground">Livraison à votre adresse</p>
                </div>
              </div>
            </div>

            {/* Message chaleureux */}
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-accent" />
                  <p className="text-primary font-semibold">Une petite note de notre équipe</p>
                </div>
                <p className="text-muted-foreground text-sm">
                  Merci de faire confiance à ED Sneakers ! Votre satisfaction est notre priorité. 
                  Notre équipe met tout en œuvre pour que votre expérience soit parfaite, 
                  de la commande jusqu'à la réception de vos nouvelles sneakers.
                </p>
              </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/commandes')}
                className="border-accent text-accent hover:bg-accent hover:text-white transition-smooth"
              >
                <Package className="w-4 h-4 mr-2" />
                Voir mes commandes
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/produits')}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-medium transition-smooth"
              >
                Découvrir nos nouveautés
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Message d'encouragement subtil */}
            <p className="mt-6 text-sm text-muted-foreground/70">
              Restez connecté sur nos réseaux sociaux pour ne rien manquer de nos dernières collections ! 
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;