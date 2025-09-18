import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Calendar, User, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  type: string;
  supplier_name?: string;
  supplier_contact?: string;
  total_amount: number;
  unit_price: number;
  quantity?: number;
  status: string;
  payment_method?: string;
  currency: string;
  due_date?: string;
  paid_date?: string;
  created_at: string;
  metadata?: {
    client_name?: string;
    client_email?: string;
    product_name?: string;
    tracking_number?: string;
    restock_batch?: string;
    delivery_date?: string;
  };
}

interface InvoicePreviewModalProps {
  invoice: Invoice;
  children: React.ReactNode;
}

export const InvoicePreviewModal = ({ invoice, children }: InvoicePreviewModalProps) => {
  const handleDownloadPDF = () => {
    // Simulate PDF generation
    toast.success('Génération du PDF en cours...', {
      description: `Facture ${invoice.invoice_number}`,
      duration: 3000,
    });
    
    // In a real implementation, this would generate and download a PDF
    const link = document.createElement('a');
    link.href = '#'; // Would be the actual PDF URL
    link.download = `Facture_${invoice.invoice_number}.pdf`;
    // link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facture {invoice.invoice_number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* En-tête facture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails de la Facture</span>
                <Badge variant={getStatusColor(invoice.status)}>
                  {getStatusLabel(invoice.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">N° Facture</div>
                  <div className="text-sm text-muted-foreground">{invoice.invoice_number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Type</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.type === 'client' ? 'Facture Client' : 'Facture Fournisseur'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Date d'émission</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Date d'échéance</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations client/fournisseur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {invoice.type === 'client' ? 'Informations Client' : 'Informations Fournisseur'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium">
                    {invoice.type === 'client' ? 'Client' : 'Fournisseur'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.type === 'client' 
                      ? invoice.metadata?.client_name || 'Client non spécifié'
                      : invoice.supplier_name || 'Fournisseur non spécifié'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Contact</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.type === 'client' 
                      ? invoice.metadata?.client_email || 'Email non disponible'
                      : invoice.supplier_contact || 'Contact non disponible'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails produit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Détails du Produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2">
                  <div>Produit</div>
                  <div>Prix Unitaire</div>
                  <div>Quantité</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>{invoice.metadata?.product_name || 'Produit non spécifié'}</div>
                  <div>{invoice.unit_price.toFixed(2)}€</div>
                  <div>{invoice.quantity || 1}</div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span className="text-lg">{invoice.total_amount.toFixed(2)} {invoice.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informations de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Mode de paiement</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.payment_method === 'credit_card' ? 'Carte de crédit' :
                     invoice.payment_method === 'bank_transfer' ? 'Virement bancaire' :
                     invoice.payment_method === 'paypal' ? 'PayPal' :
                     invoice.payment_method === 'check' ? 'Chèque' :
                     invoice.payment_method || 'Non spécifié'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Date de paiement</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString('fr-FR') : 'Non payé'}
                  </div>
                </div>
              </div>
              
              {invoice.metadata?.tracking_number && (
                <div>
                  <div className="text-sm font-medium">N° de suivi</div>
                  <div className="text-sm text-muted-foreground">{invoice.metadata.tracking_number}</div>
                </div>
              )}
              
              {invoice.metadata?.delivery_date && (
                <div>
                  <div className="text-sm font-medium">Date de livraison prévue</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(invoice.metadata.delivery_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};