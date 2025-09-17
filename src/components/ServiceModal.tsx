import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Truck, Shield, RotateCcw, Star } from "lucide-react";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: 'shipping' | 'quality' | 'returns' | 'support' | null;
}

const ServiceModal = ({ open, onOpenChange, service }: ServiceModalProps) => {
  const serviceDetails = {
    shipping: {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Livraison Gratuite",
      subtitle: "Dès 50€ d'achat",
      content: (
        <div className="space-y-4">
          <p>Profitez de la livraison gratuite pour toutes vos commandes à partir de 50€.</p>
          <div className="space-y-2">
            <h4 className="font-semibold">Options de livraison :</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Livraison standard (2-3 jours ouvrés) - Gratuite dès 50€</li>
              <li>Livraison express (24h) - 9.90€</li>
              <li>Point relais - Gratuite dès 30€</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Les commandes passées avant 14h sont expédiées le jour même.
          </p>
        </div>
      )
    },
    quality: {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Garantie Qualité",
      subtitle: "Produits authentiques uniquement",
      content: (
        <div className="space-y-4">
          <p>Nous garantissons l'authenticité de tous nos produits.</p>
          <div className="space-y-2">
            <h4 className="font-semibold">Notre engagement :</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>100% des produits sont authentiques</li>
              <li>Contrôle qualité rigoureux</li>
              <li>Partenariat direct avec les marques</li>
              <li>Certificat d'authenticité fourni</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            En cas de doute sur l'authenticité, nous nous engageons à un remboursement intégral.
          </p>
        </div>
      )
    },
    returns: {
      icon: <RotateCcw className="h-8 w-8 text-primary" />,
      title: "Retours Gratuits",
      subtitle: "30 jours pour changer d'avis",
      content: (
        <div className="space-y-4">
          <p>Changez d'avis ? Pas de problème ! Vous avez 30 jours pour retourner vos articles.</p>
          <div className="space-y-2">
            <h4 className="font-semibold">Conditions de retour :</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Produits dans leur état d'origine</li>
              <li>Emballage d'origine conservé</li>
              <li>Étiquettes non retirées</li>
              <li>Retour sous 30 jours</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Comment retourner :</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Contactez notre service client</li>
              <li>Imprimez l'étiquette de retour</li>
              <li>Emballez soigneusement</li>
              <li>Déposez le colis</li>
            </ol>
          </div>
          <p className="text-sm text-muted-foreground">
            Remboursement sous 5-7 jours après réception du retour.
          </p>
        </div>
      )
    },
    support: {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Service Client",
      subtitle: "Support 7j/7 de 9h à 18h",
      content: (
        <div className="space-y-4">
          <p>Notre équipe est là pour vous accompagner et répondre à toutes vos questions.</p>
          <div className="space-y-2">
            <h4 className="font-semibold">Nous contacter :</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Téléphone : 01 23 45 67 89</li>
              <li>Email : support@edsneakers.com</li>
              <li>Chat en direct sur le site</li>
              <li>Réseaux sociaux</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Horaires :</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lundi - Vendredi : 9h - 18h</li>
              <li>Samedi : 10h - 17h</li>
              <li>Dimanche : 14h - 17h</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Temps de réponse moyen : 2 heures pendant les heures d'ouverture.
          </p>
        </div>
      )
    }
  };

  if (!service || !serviceDetails[service]) {
    return null;
  }

  const details = serviceDetails[service];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {details.icon}
            <div>
              <div className="text-lg">{details.title}</div>
              <div className="text-sm text-muted-foreground font-normal">{details.subtitle}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {details.content}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;