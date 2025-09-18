import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Calendar,
  TrendingUp,
  Receipt,
  Users,
  Filter,
  Euro,
  Building,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InvoicePreviewModal } from './InvoicePreviewModal';

interface Invoice {
  id: string;
  invoice_number: string;
  type: 'supplier' | 'client';
  supplier_name?: string;
  supplier_contact?: string;
  order_id?: string;
  variant_id?: string;
  quantity?: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  payment_method?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    client_name?: string;
    client_email?: string;
    product_name?: string;
    tracking_number?: string;
    restock_batch?: string;
    delivery_date?: string;
  };
}

export const Factures = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data as Invoice[]) || []);
    } catch (error: any) {
      console.error('Error loading invoices:', error);
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'paid') {
        updateData.paid_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;

      setInvoices(invoices.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: newStatus as any, paid_date: newStatus === 'paid' ? new Date().toISOString() : inv.paid_date }
          : inv
      ));

      toast.success(`Statut de facture mis à jour vers ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating invoice status:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.supplier_name && invoice.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.metadata?.client_name && invoice.metadata.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.metadata?.client_email && invoice.metadata.client_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !dateFilter || 
      new Date(invoice.created_at).toISOString().split('T')[0] === dateFilter;
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || invoice.type === typeFilter;
    
    return matchesSearch && matchesDate && matchesStatus && matchesType;
  });

  const supplierInvoices = filteredInvoices.filter(inv => inv.type === 'supplier');
  const clientInvoices = filteredInvoices.filter(inv => inv.type === 'client');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Factures</h2>
          <p className="text-muted-foreground">
            Gérez toutes vos factures fournisseurs et clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Filtrer par date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paid">Payées</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="supplier">Fournisseurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              Fournisseurs: {supplierInvoices.length} • Clients: {clientInvoices.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures Payées</CardTitle>
            <Euro className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {invoices.filter(inv => inv.status === 'paid').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100).toFixed(0)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {invoices.filter(inv => inv.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nécessitent un suivi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.reduce((sum, inv) => sum + inv.total_amount, 0).toFixed(2)}€
            </div>
            <p className="text-xs text-muted-foreground">
              Toutes factures confondues
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les Factures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">#{invoice.invoice_number}</h4>
                        <Badge variant={invoice.type === 'supplier' ? 'secondary' : 'outline'}>
                          {invoice.type === 'supplier' ? <Building className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                          {invoice.type === 'supplier' ? 'Fournisseur' : 'Client'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.supplier_name || 'Client'} • {invoice.total_amount}€
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                        {invoice.payment_method && ` • ${invoice.payment_method}`}
                      </p>
                    </div>
                     <div className="flex items-center space-x-2">
                       <select
                         value={invoice.status}
                         onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                         className="px-3 py-1 border rounded text-sm"
                       >
                         <option value="pending">En attente</option>
                         <option value="paid">Payée</option>
                         <option value="overdue">En retard</option>
                         <option value="cancelled">Annulée</option>
                       </select>
                       <Badge variant={getStatusColor(invoice.status)}>
                         {getStatusLabel(invoice.status)}
                       </Badge>
                       <div className="flex items-center space-x-2">
                          {invoice.status === 'overdue' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                toast.success('Une relance a été envoyée au fournisseur.', {
                                  description: `Relance pour la facture ${invoice.invoice_number}`
                                });
                              }}
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              Relancer le fournisseur
                            </Button>
                          )}
                         <InvoicePreviewModal invoice={invoice}>
                           <Button size="sm" variant="outline">
                             <Eye className="h-4 w-4 mr-1" />
                             Voir
                           </Button>
                         </InvoicePreviewModal>
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => toast.success('Génération du PDF en cours...', { description: `Facture ${invoice.invoice_number}` })}
                         >
                           <Download className="h-4 w-4 mr-1" />
                           PDF
                         </Button>
                       </div>
                     </div>
                  </div>
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune facture trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Factures Fournisseurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">#{invoice.invoice_number}</h4>
                      <p className="text-sm text-muted-foreground">
                        {invoice.supplier_name} • {invoice.total_amount}€
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                     <div className="flex items-center space-x-2">
                       <Badge variant={getStatusColor(invoice.status)}>
                         {getStatusLabel(invoice.status)}
                       </Badge>
                       <InvoicePreviewModal invoice={invoice}>
                         <Button size="sm" variant="outline">
                           <Eye className="h-4 w-4 mr-1" />
                           Voir
                         </Button>
                       </InvoicePreviewModal>
                     </div>
                  </div>
                ))}
                {supplierInvoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune facture fournisseur trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Factures Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">#{invoice.invoice_number}</h4>
                      <p className="text-sm text-muted-foreground">
                        Client • {invoice.total_amount}€
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                     <div className="flex items-center space-x-2">
                       <Badge variant={getStatusColor(invoice.status)}>
                         {getStatusLabel(invoice.status)}
                       </Badge>
                       <InvoicePreviewModal invoice={invoice}>
                         <Button size="sm" variant="outline">
                           <Eye className="h-4 w-4 mr-1" />
                           Voir
                         </Button>
                       </InvoicePreviewModal>
                     </div>
                  </div>
                ))}
                {clientInvoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune facture client trouvée
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};