import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Search } from "lucide-react";

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  distance: string;
  hours: string;
}

interface PickupPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPoint: (point: PickupPoint) => void;
  selectedPoint?: PickupPoint;
}

const mockPickupPoints: PickupPoint[] = [
  {
    id: "1",
    name: "Mondial Relay - Tabac de la Paix",
    address: "12 rue de la Paix",
    city: "Paris",
    postalCode: "75001",
    distance: "0.2 km",
    hours: "Lun-Sam: 8h-19h"
  },
  {
    id: "2", 
    name: "Mondial Relay - Pharmacie Central",
    address: "45 boulevard Haussmann",
    city: "Paris",
    postalCode: "75009",
    distance: "0.8 km",
    hours: "Lun-Ven: 9h-19h, Sam: 9h-17h"
  },
  {
    id: "3",
    name: "Mondial Relay - Épicerie du Coin",
    address: "23 avenue de la République",
    city: "Paris",
    postalCode: "75011",
    distance: "1.2 km", 
    hours: "Lun-Dim: 7h-22h"
  }
];

export const PickupPointModal = ({ open, onOpenChange, onSelectPoint, selectedPoint }: PickupPointModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(selectedPoint?.id || "");

  const filteredPoints = mockPickupPoints.filter(point => 
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.postalCode.includes(searchQuery)
  );

  const handleConfirm = () => {
    const selected = mockPickupPoints.find(p => p.id === selectedId);
    if (selected) {
      onSelectPoint(selected);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Choisir un Point Relais
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un point relais pour récupérer votre commande
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Rechercher un point relais</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, adresse ou code postal..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Points List */}
          <div className="max-h-96 overflow-y-auto">
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="space-y-3">
                {filteredPoints.map((point) => (
                  <div key={point.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/20 cursor-pointer">
                    <RadioGroupItem value={point.id} id={point.id} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm">{point.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {point.distance}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {point.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {point.postalCode} {point.city}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {point.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {filteredPoints.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
              <p>Aucun point relais trouvé</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedId}
              className="flex-1"
            >
              Confirmer le choix
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};