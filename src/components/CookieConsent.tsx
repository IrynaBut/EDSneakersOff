import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl shadow-lg border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Nous utilisons des cookies</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ce site utilise des cookies pour améliorer votre expérience de navigation, 
                analyser le trafic et personnaliser le contenu. En continuant à utiliser ce site, 
                vous acceptez notre utilisation des cookies.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleAccept} size="sm">
                  Accepter tous les cookies
                </Button>
                <Button onClick={handleDecline} variant="outline" size="sm">
                  Refuser
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Gérer les préférences
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="flex-shrink-0 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;