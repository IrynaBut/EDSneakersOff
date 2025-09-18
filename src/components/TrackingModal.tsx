import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Clock, CheckCircle, Truck, ExternalLink } from "lucide-react";

interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  trackingNumber: string;
}

export const TrackingModal = ({ open, onOpenChange, orderNumber, trackingNumber }: TrackingModalProps) => {
  const handleExternalTracking = () => {
    // Simulate redirect to carrier website (Mondial Relay)
    const carrierUrl = `https://www.mondialrelay.fr/suivi-de-colis/?numeroDeCodebarre=${trackingNumber}`;
    window.open(carrierUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Suivi de Colis
          </DialogTitle>
          <DialogDescription>
            Commande {orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Tracking Number */}
          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Numéro de suivi</p>
                <p className="text-lg font-mono text-primary">{trackingNumber}</p>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                En transit
              </Badge>
            </div>
          </div>

          {/* Tracking Status */}
          <div className="space-y-3">
            <h3 className="font-semibold">État de la livraison</h3>
            
            <div className="space-y-3">
              {/* Shipped */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Colis expédié</p>
                  <p className="text-sm text-muted-foreground">Hier, 14:30</p>
                </div>
              </div>

              {/* In Transit */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Truck className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">En transit vers le point relais</p>
                  <p className="text-sm text-muted-foreground">Aujourd'hui, 08:45</p>
                </div>
              </div>

              {/* Expected Delivery */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Livraison au point relais</p>
                  <p className="text-sm text-muted-foreground">Demain, avant 18h</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Info */}
          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-accent">Livraison prévue demain</p>
                <p className="text-sm text-muted-foreground">
                  Votre colis sera disponible dans votre point relais avant 18h. 
                  Pensez à apporter une pièce d'identité.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Fermer
            </Button>
            <Button onClick={handleExternalTracking} className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Suivre sur Mondial Relay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};