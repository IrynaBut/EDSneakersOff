import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Package, Euro, ShoppingCart, CreditCard, Truck, RefreshCcw, Shield, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CGV = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Conditions Générales de Vente (CGV)</h1>
            <p className="text-muted-foreground">
              EDSneakers - Conditions applicables à tous nos clients
            </p>
          </div>

          <div className="space-y-6">
            {/* Objet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  1. Objet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les présentes Conditions Générales de Vente définissent les droits et obligations de EDSneakers SAS, 
                  12 Rue des Lilas, 69001 Lyon, France, et de ses clients dans le cadre de la vente en ligne de baskets 
                  et articles associés via le site www.edsneakers.com
                </p>
              </CardContent>
            </Card>

            {/* Produits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  2. Produits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les produits proposés à la vente sont décrits et présentés avec la plus grande exactitude possible. 
                  Les photographies et visuels ne sont pas contractuels.
                </p>
              </CardContent>
            </Card>

            {/* Prix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="w-5 h-5" />
                  3. Prix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Les prix sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison.
                </p>
                <p>
                  EDSneakers se réserve le droit de modifier ses prix à tout moment, tout en garantissant 
                  l'application du tarif en vigueur au moment de la commande.
                </p>
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  4. Commandes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Le client valide sa commande après avoir rempli son panier et accepté les présentes CGV.
                </p>
                <p>
                  Une confirmation de commande est envoyée par email.
                </p>
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  5. Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Le paiement est exigible immédiatement à la commande.</p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Moyens de paiement acceptés :</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Carte bancaire (Visa, Mastercard)</li>
                    <li>PayPal (redirection vers le site officiel PayPal)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  6. Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <p><strong>Livraison :</strong> France et Europe</p>
                  <p><strong>Délais moyens :</strong> 3 à 7 jours ouvrés</p>
                  <p><strong>Frais de livraison :</strong> Indiqués avant validation de la commande</p>
                </div>
              </CardContent>
            </Card>

            {/* Droit de rétractation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5" />
                  7. Droit de rétractation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Conformément à la loi, le client dispose d'un délai de 14 jours à compter de la réception 
                  pour exercer son droit de rétractation, sans justification.
                </p>
                <p>
                  Les articles doivent être retournés neufs, non portés, dans leur emballage d'origine.
                </p>
              </CardContent>
            </Card>

            {/* Retours et remboursements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5" />
                  8. Retours et remboursements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  En cas de retour conforme, le remboursement sera effectué sous 14 jours après réception du colis.
                </p>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  9. Garanties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tous les produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés.
                </p>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  10. Droit applicable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Lyon.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGV;