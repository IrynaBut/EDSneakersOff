import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building, Server, Shield, Package, AlertTriangle, Database, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentionsLegales = () => {
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
            <h1 className="text-3xl font-bold mb-2">Mentions Légales</h1>
            <p className="text-muted-foreground">
              Informations légales et réglementaires du site EDSneakers
            </p>
          </div>

          <div className="space-y-6">
            {/* Éditeur du site */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  1. Éditeur du site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Le site EDSneakers est édité par :</p>
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <p><strong>Nom de l'entreprise :</strong> EDSneakers SAS</p>
                  <p><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
                  <p><strong>Siège social :</strong> 12 Rue des Lilas, 69001 Lyon, France</p>
                  <p><strong>Numéro SIRET :</strong> 891 456 789 00012</p>
                  <p><strong>Numéro de TVA intracommunautaire :</strong> FR45 891456789</p>
                  <p><strong>Directeur de publication :</strong> Éric Dupont</p>
                  <p><strong>Adresse email de contact :</strong> contact@edsneakers.com</p>
                  <p><strong>Téléphone :</strong> +33 (0)4 72 12 34 56</p>
                </div>
              </CardContent>
            </Card>

            {/* Hébergeur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  2. Hébergeur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Le site est hébergé par :</p>
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <p><strong>Nom de l'hébergeur :</strong> OVH SAS</p>
                  <p><strong>Adresse :</strong> 2 Rue Kellermann, 59100 Roubaix, France</p>
                  <p><strong>Téléphone :</strong> +33 (0)9 72 10 10 07</p>
                </div>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  3. Propriété intellectuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  L'ensemble du contenu du site (textes, visuels, logos, marques, bases de données, etc.) 
                  est protégé par le Code de la propriété intellectuelle.
                </p>
                <p className="mt-2">
                  Toute reproduction, représentation, modification ou diffusion, totale ou partielle, 
                  est strictement interdite sans autorisation écrite préalable de EDSneakers.
                </p>
              </CardContent>
            </Card>

            {/* Produits et services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  4. Produits et services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  EDSneakers est une boutique en ligne spécialisée dans la vente de baskets premium 
                  pour hommes, femmes et enfants.
                </p>
                <p className="mt-2">
                  Les caractéristiques essentielles des produits sont indiquées sur chaque fiche produit.
                </p>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  5. Responsabilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  EDSneakers s'efforce d'assurer au mieux la mise à jour et l'exactitude des informations 
                  diffusées sur le site.
                </p>
                <p className="mt-2">
                  Cependant, la responsabilité de l'éditeur ne saurait être engagée en cas d'erreurs, 
                  d'omissions ou d'interruptions de service.
                </p>
              </CardContent>
            </Card>

            {/* Données personnelles et cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  6. Données personnelles et cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Les données personnelles collectées sont utilisées uniquement dans le cadre de la 
                  relation commerciale avec le client (traitement des commandes, newsletter, suivi des livraisons).
                </p>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
                  d'un droit d'accès, de rectification, d'opposition et de suppression de vos données.
                </p>
                <p>
                  Ces droits peuvent être exercés en écrivant à : <strong>dpo@edsneakers.com</strong>
                </p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <p>
                    Le site utilise des cookies afin d'améliorer l'expérience utilisateur et mesurer l'audience. 
                    L'utilisateur peut gérer ses préférences via la fenêtre de gestion des cookies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Droit applicable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  7. Droit applicable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                  et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
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

export default MentionsLegales;