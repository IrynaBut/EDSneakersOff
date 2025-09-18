import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, Building, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface SupplierContactModalProps {
  supplier: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    delay?: string;
  };
  productName?: string;
  children: React.ReactNode;
}

export const SupplierContactModal = ({ supplier, productName, children }: SupplierContactModalProps) => {
  const handleCall = () => {
    if (supplier.phone) {
      window.location.href = `tel:${supplier.phone}`;
    }
  };

  const handleEmail = () => {
    if (supplier.email) {
      const subject = encodeURIComponent(`Manque de stock - ${productName || 'Produit'}`);
      const body = encodeURIComponent(`Bonjour,\n\nNous souhaitons nous approvisionner en ${productName || 'produit'} mais constatons un manque de stock.\n\nPouvez-vous nous indiquer vos disponibilités et délais de réapprovisionnement ?\n\nCordialement`);
      window.location.href = `mailto:${supplier.email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Contacter le Fournisseur
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Alert message */}
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Stock insuffisant</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              Le fournisseur ne dispose pas du stock nécessaire pour cette commande.
            </p>
          </div>

          {/* Supplier info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4" />
                Informations Fournisseur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium">{supplier.name}</div>
                {supplier.address && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {supplier.address}
                  </div>
                )}
              </div>
              
              {supplier.delay && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Délai habituel: <Badge variant="outline">{supplier.delay}</Badge>
                  </span>
                </div>
              )}
              
              <Separator />
              
              {/* Contact actions */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Options de contact :</div>
                
                {supplier.email && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEmail}
                    className="w-full justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email à {supplier.email}
                  </Button>
                )}
                
                {supplier.phone && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCall}
                    className="w-full justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler {supplier.phone}
                  </Button>
                )}
                
                {!supplier.email && !supplier.phone && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    Informations de contact non disponibles
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {productName && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <strong>Produit concerné :</strong> {productName}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};