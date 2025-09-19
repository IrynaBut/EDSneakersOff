import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cookie, Settings, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PolitiqueCookies = () => {
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
            <h1 className="text-3xl font-bold mb-2">Politique de Cookies</h1>
            <p className="text-muted-foreground">
              EDSneakers - Utilisation des cookies sur notre site
            </p>
          </div>

          <div className="space-y-6">
            {/* Utilisation des cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  1. Utilisation des cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Notre site utilise des cookies pour améliorer l'expérience utilisateur, 
                  mesurer l'audience et personnaliser le contenu.
                </p>
              </CardContent>
            </Card>

            {/* Types de cookies utilisés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  2. Types de cookies utilisés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-600 mb-2">Cookies nécessaires</h4>
                    <p className="text-sm">Fonctionnement du panier, connexion au compte.</p>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-600 mb-2">Cookies de performance</h4>
                    <p className="text-sm">Analyse du trafic (Google Analytics, par ex.).</p>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-600 mb-2">Cookies marketing</h4>
                    <p className="text-sm">Publicité ciblée (si applicable).</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consentement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  3. Consentement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Lors de votre première visite, une fenêtre de consentement s'affiche. Vous pouvez :
                </p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Accepter tous les cookies</li>
                    <li>Refuser tous les cookies</li>
                    <li>Gérer vos préférences</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Gestion des préférences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  4. Gestion des préférences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  En cliquant sur "Gérer les préférences", une fenêtre s'ouvre permettant de sélectionner 
                  les types de cookies autorisés ou refusés.
                </p>
              </CardContent>
            </Card>

            {/* Durée */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  5. Durée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les cookies sont conservés pour une durée maximale de 13 mois.
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

export default PolitiqueCookies;