import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Shield, RotateCcw, Headphones, HelpCircle, Scale, FileText, Cookie } from "lucide-react";

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'delivery' | 'support' | 'faq' | 'legal' | 'cgv' | 'privacy' | 'cookies' | 'size-guide';
}

export const SupportModal = ({ open, onOpenChange, type }: SupportModalProps) => {
  const getModalContent = () => {
    switch (type) {
      case 'delivery':
        return {
          title: "Livraison & Retours",
          icon: <Truck className="w-6 h-6" />,
          content: (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Livraison Gratuite
                </h4>
                <p className="text-sm text-muted-foreground">
                  • Livraison gratuite dès 50€ d'achat<br/>
                  • Expédition sous 24-48h ouvrées<br/>
                  • Suivi de commande disponible<br/>
                  • Livraison à domicile ou en point relais
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retours Gratuits
                </h4>
                <p className="text-sm text-muted-foreground">
                  • 30 jours pour changer d'avis<br/>
                  • Retour gratuit depuis la France<br/>
                  • Remboursement sous 14 jours<br/>
                  • Échange de taille possible
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Garantie Qualité
                </h4>
                <p className="text-sm text-muted-foreground">
                  • Produits authentiques garantis<br/>
                  • Contrôle qualité systématique<br/>
                  • Service après-vente réactif
                </p>
              </div>
            </div>
          )
        };

      case 'support':
        return {
          title: "Service Client",
          icon: <Headphones className="w-6 h-6" />,
          content: (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Nos Horaires</h4>
                <p className="text-sm text-muted-foreground">
                  Du lundi au vendredi : 9h - 18h<br/>
                  Samedi : 10h - 17h<br/>
                  Dimanche : Fermé
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Nous Contacter</h4>
                <p className="text-sm text-muted-foreground">
                  📞 01 23 45 67 89<br/>
                  ✉️ contact@edsneakers.fr<br/>
                  💬 Chat en ligne disponible
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Assistance</h4>
                <p className="text-sm text-muted-foreground">
                  • Aide au choix de la taille<br/>
                  • Conseils produits<br/>
                  • Suivi de commande<br/>
                  • Problèmes de livraison
                </p>
              </div>
            </div>
          )
        };

      case 'faq':
        return {
          title: "Questions Fréquentes",
          icon: <HelpCircle className="w-6 h-6" />,
          content: (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Comment choisir ma taille ?</h4>
                <p className="text-sm text-muted-foreground">
                  Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, n'hésitez pas à nous contacter.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Puis-je modifier ma commande ?</h4>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez modifier votre commande dans les 2h suivant la validation, en nous contactant directement.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Les produits sont-ils authentiques ?</h4>
                <p className="text-sm text-muted-foreground">
                  Tous nos produits sont 100% authentiques et proviennent directement des marques officielles.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Comment suivre ma commande ?</h4>
                <p className="text-sm text-muted-foreground">
                  Un email avec le lien de suivi vous est envoyé dès l'expédition de votre commande.
                </p>
              </div>
            </div>
          )
        };

      case 'size-guide':
        return {
          title: "Guide des Tailles",
          icon: <Badge className="w-6 h-6" />,
          content: (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Pour choisir la bonne taille, mesurez votre pied et référez-vous au tableau ci-dessous :
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="border-r border-border p-2 text-center">EU</th>
                      <th className="border-r border-border p-2 text-center">US</th>
                      <th className="border-r border-border p-2 text-center">UK</th>
                      <th className="p-2 text-center">Longueur (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-2 text-center">39</td>
                      <td className="border-r border-border p-2 text-center">6.5</td>
                      <td className="border-r border-border p-2 text-center">6</td>
                      <td className="p-2 text-center">24.5</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-2 text-center">40</td>
                      <td className="border-r border-border p-2 text-center">7</td>
                      <td className="border-r border-border p-2 text-center">6.5</td>
                      <td className="p-2 text-center">25</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-2 text-center">41</td>
                      <td className="border-r border-border p-2 text-center">7.5</td>
                      <td className="border-r border-border p-2 text-center">7</td>
                      <td className="p-2 text-center">25.5</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-2 text-center">42</td>
                      <td className="border-r border-border p-2 text-center">8</td>
                      <td className="border-r border-border p-2 text-center">7.5</td>
                      <td className="p-2 text-center">26</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border-r border-border p-2 text-center">43</td>
                      <td className="border-r border-border p-2 text-center">9</td>
                      <td className="border-r border-border p-2 text-center">8.5</td>
                      <td className="p-2 text-center">27</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Conseil :</strong> Mesurez votre pied en fin de journée quand il est légèrement gonflé pour un ajustement optimal.
                </p>
              </div>
            </div>
          )
        };

      case 'legal':
        return {
          title: "Mentions Légales",
          icon: <Scale className="w-6 h-6" />,
          content: (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Éditeur du site</h4>
                <p className="text-muted-foreground">
                  ED Sneakers SARL<br/>
                  Capital social : 50 000€<br/>
                  RCS Paris : 123 456 789<br/>
                  TVA : FR12345678901
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Siège social</h4>
                <p className="text-muted-foreground">
                  123 Avenue des Champs-Élysées<br/>
                  75008 Paris, France<br/>
                  Téléphone : 01 23 45 67 89
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Directeur de publication</h4>
                <p className="text-muted-foreground">
                  M. Jean Dupont<br/>
                  Email : legal@edsneakers.fr
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Hébergement</h4>
                <p className="text-muted-foreground">
                  Hébergé par Vercel Inc.<br/>
                  440 N Baywood Ave, San Jose, CA 95128
                </p>
              </div>
            </div>
          )
        };

      case 'cgv':
        return {
          title: "Conditions Générales de Vente",
          icon: <FileText className="w-6 h-6" />,
          content: (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Article 1 - Objet</h4>
                <p className="text-muted-foreground">
                  Les présentes conditions générales de vente s'appliquent à toutes les commandes passées sur le site edsneakers.fr
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Article 2 - Commandes</h4>
                <p className="text-muted-foreground">
                  Toute commande implique l'acceptation sans réserve des présentes conditions générales de vente.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Article 3 - Prix</h4>
                <p className="text-muted-foreground">
                  Les prix sont indiqués en euros TTC. Ils incluent la TVA au taux en vigueur.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Article 4 - Livraison</h4>
                <p className="text-muted-foreground">
                  La livraison est gratuite en France métropolitaine dès 50€ d'achat.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Article 5 - Droit de rétractation</h4>
                <p className="text-muted-foreground">
                  Vous disposez d'un délai de 30 jours pour retourner tout article ne vous convenant pas.
                </p>
              </div>
            </div>
          )
        };

      case 'privacy':
        return {
          title: "Politique de Confidentialité",
          icon: <Shield className="w-6 h-6" />,
          content: (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Collecte des données</h4>
                <p className="text-muted-foreground">
                  Nous collectons uniquement les données nécessaires au traitement de vos commandes et à l'amélioration de nos services.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Utilisation des données</h4>
                <p className="text-muted-foreground">
                  Vos données sont utilisées pour :<br/>
                  • Traiter vos commandes<br/>
                  • Vous envoyer des informations sur nos produits<br/>
                  • Améliorer votre expérience utilisateur
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Vos droits</h4>
                <p className="text-muted-foreground">
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-muted-foreground">
                  Pour exercer vos droits : privacy@edsneakers.fr
                </p>
              </div>
            </div>
          )
        };

      case 'cookies':
        return {
          title: "Politique des Cookies",
          icon: <Cookie className="w-6 h-6" />,
          content: (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Qu'est-ce qu'un cookie ?</h4>
                <p className="text-muted-foreground">
                  Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite d'un site web.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Types de cookies utilisés</h4>
                <p className="text-muted-foreground">
                  • <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site<br/>
                  • <strong>Cookies analytiques :</strong> Pour améliorer nos services<br/>
                  • <strong>Cookies marketing :</strong> Pour personnaliser la publicité
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Gestion des cookies</h4>
                <p className="text-muted-foreground">
                  Vous pouvez à tout moment modifier vos préférences de cookies dans les paramètres de votre navigateur.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Durée de conservation</h4>
                <p className="text-muted-foreground">
                  Les cookies sont conservés pour une durée maximale de 13 mois.
                </p>
              </div>
            </div>
          )
        };

      default:
        return {
          title: "Information",
          icon: <HelpCircle className="w-6 h-6" />,
          content: <p>Contenu non disponible.</p>
        };
    }
  };

  const { title, icon, content } = getModalContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {content}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};