import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Users, Share, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PolitiqueConfidentialite = () => {
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
            <h1 className="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
            <p className="text-muted-foreground">
              EDSneakers - Protection de vos données personnelles
            </p>
          </div>

          <div className="space-y-6">
            {/* Collecte des données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  1. Collecte des données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  EDSneakers collecte uniquement les données nécessaires à la gestion des commandes, livraisons, 
                  paiements et à l'envoi de newsletters si vous y avez consenti.
                </p>
              </CardContent>
            </Card>

            {/* Utilisation des données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  2. Utilisation des données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Vos données sont utilisées pour :</p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Le traitement et suivi des commandes</li>
                    <li>La gestion de votre compte client</li>
                    <li>L'envoi d'emails promotionnels et newsletters (si abonnement)</li>
                    <li>Le suivi des statistiques de fréquentation du site</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Partage des données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="w-5 h-5" />
                  3. Partage des données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Les données personnelles ne sont jamais revendues.
                </p>
                <p>
                  Elles peuvent être transmises uniquement à nos prestataires de services (livraison, paiement).
                </p>
              </CardContent>
            </Card>

            {/* Durée de conservation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  4. Durée de conservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les données sont conservées pendant la durée légale nécessaire à la gestion commerciale, 
                  puis archivées ou supprimées.
                </p>
              </CardContent>
            </Card>

            {/* Vos droits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  5. Vos droits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, 
                  de suppression et d'opposition.
                </p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <p><strong>Pour exercer vos droits :</strong> dpo@edsneakers.com</p>
                </div>
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

export default PolitiqueConfidentialite;