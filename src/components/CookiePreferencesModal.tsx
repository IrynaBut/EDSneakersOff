import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePreferencesModal = ({ isOpen, onClose }: CookiePreferencesModalProps) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });
  const { toast } = useToast();

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de cookies ont été mises à jour avec succès.",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des préférences de cookies</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
            Vous pouvez choisir quels types de cookies autoriser.
          </p>

          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="essential" className="text-base font-medium">
                  Cookies essentiels
                </Label>
                <Switch 
                  id="essential"
                  checked={preferences.essential}
                  disabled={true}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. 
                Ils permettent de naviguer sur le site et d'utiliser ses fonctionnalités.
              </p>
            </div>

            <Separator />

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-base font-medium">
                  Cookies d'analyse
                </Label>
                <Switch 
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ces cookies nous aident à comprendre comment vous utilisez notre site 
                pour améliorer votre expérience de navigation.
              </p>
            </div>

            <Separator />

            {/* Marketing Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing" className="text-base font-medium">
                  Cookies marketing
                </Label>
                <Switch 
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ces cookies sont utilisés pour vous proposer des publicités 
                personnalisées et mesurer l'efficacité de nos campagnes.
              </p>
            </div>

            <Separator />

            {/* Functional Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="functional" className="text-base font-medium">
                  Cookies fonctionnels
                </Label>
                <Switch 
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, functional: checked }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ces cookies permettent d'améliorer les fonctionnalités du site, 
                comme la sauvegarde de vos préférences et la personnalisation du contenu.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleSavePreferences} className="flex-1">
              Sauvegarder les préférences
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setPreferences({
                  essential: true,
                  analytics: false,
                  marketing: false,
                  functional: false,
                });
              }}
              className="flex-1"
            >
              Refuser tout
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setPreferences({
                  essential: true,
                  analytics: true,
                  marketing: true,
                  functional: true,
                });
              }}
              className="flex-1"
            >
              Accepter tout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesModal;