import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, RotateCcw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  metadata?: {
    tracking_number?: string;
  };
}

interface OrderActionsProps {
  order: Order;
}

export const OrderActions = ({ order }: OrderActionsProps) => {
  const canReturn = () => {
    if (order.status !== 'delivered') return false;
    
    const deliveryDate = new Date(order.created_at);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffInDays <= 30;
  };

  const canTrack = () => {
    return order.status === 'shipped' || order.status === 'delivered';
  };

  const handleReturn = () => {
    toast.info('Demande de retour initiée', {
      description: 'Un email avec les instructions de retour vous a été envoyé.',
    });
  };

  const handleTrack = () => {
    const trackingNumber = order.metadata?.tracking_number || generateTrackingNumber(order.order_number);
    
    // Simuler l'ouverture du suivi Mondial Relay
    const mondialRelayUrl = `https://www.mondialrelay.com/suivi-de-colis/?numeroExpedition=${trackingNumber}`;
    
    toast.success('Redirection vers le suivi de colis', {
      description: `Numéro de suivi: ${trackingNumber}`,
    });
    
    // Dans un environnement réel, on ouvrirait la nouvelle fenêtre
    console.log('Tracking URL:', mondialRelayUrl);
  };

  const generateTrackingNumber = (orderNumber: string) => {
    // Générer un numéro de suivi fictif basé sur le numéro de commande
    const suffix = orderNumber.slice(-4);
    return `FR${suffix}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const getStatusBadge = () => {
    const statusConfig = {
      'pending': { label: 'En préparation', variant: 'secondary' as const },
      'confirmed': { label: 'Confirmée', variant: 'default' as const },
      'processing': { label: 'En préparation', variant: 'secondary' as const },
      'shipped': { label: 'Expédiée', variant: 'default' as const },
      'delivered': { label: 'Livrée', variant: 'outline' as const },
      'cancelled': { label: 'Annulée', variant: 'destructive' as const }
    };

    const config = statusConfig[order.status as keyof typeof statusConfig];
    return config || { label: order.status, variant: 'secondary' as const };
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="flex flex-col gap-2">
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
      
      <div className="flex gap-2">
        {canTrack() && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleTrack}
            className="flex items-center gap-1"
          >
            <Truck className="h-4 w-4" />
            Suivre le colis
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        
        {canReturn() && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleReturn}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Retourner un article
          </Button>
        )}
      </div>
    </div>
  );
};