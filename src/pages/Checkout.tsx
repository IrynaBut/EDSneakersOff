import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useOrders, CreateOrderData } from '@/hooks/useOrders';
import { ShoppingCart, CreditCard, MapPin, User, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalAmount, loading: cartLoading } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateOrderData>({
    billing_address: {
      first_name: '',
      last_name: '',
      email: user?.email || '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postal_code: '',
      country: 'France'
    },
    shipping_address: {
      first_name: '',
      last_name: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      postal_code: '',
      country: 'France'
    },
    payment_method: 'card',
    notes: ''
  });

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (items.length === 0 && !cartLoading) {
      navigate('/produits');
    }
  }, [user, items, cartLoading, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
  };

  const handleInputChange = (section: 'billing_address' | 'shipping_address', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.billing_address,
          email: undefined as any // Remove email from shipping
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const { billing_address, shipping_address } = formData;
    
    // Required billing fields
    if (!billing_address.first_name || !billing_address.last_name || 
        !billing_address.email || !billing_address.address_line_1 || 
        !billing_address.city || !billing_address.postal_code) {
      setError('Veuillez remplir tous les champs obligatoires de facturation');
      return false;
    }

    // Required shipping fields
    if (!sameAsShipping) {
      if (!shipping_address.first_name || !shipping_address.last_name || 
          !shipping_address.address_line_1 || !shipping_address.city || 
          !shipping_address.postal_code) {
        setError('Veuillez remplir tous les champs obligatoires de livraison');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const orderData = {
      ...formData,
      shipping_address: sameAsShipping ? {
        first_name: formData.billing_address.first_name,
        last_name: formData.billing_address.last_name,
        address_line_1: formData.billing_address.address_line_1,
        address_line_2: formData.billing_address.address_line_2,
        city: formData.billing_address.city,
        postal_code: formData.billing_address.postal_code,
        country: formData.billing_address.country
      } : formData.shipping_address
    };

    const { order, error } = await createOrder(orderData);
    
    if (error) {
      setError(error);
    } else if (order) {
      // Redirect to order confirmation or payment
      navigate(`/commande/${order.id}`);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finaliser la commande</h1>
          <p className="text-muted-foreground">Complétez vos informations pour passer votre commande</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Adresse de facturation
                  </CardTitle>
                  <CardDescription>
                    Informations nécessaires pour la facturation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-first-name">Prénom *</Label>
                      <Input
                        id="billing-first-name"
                        value={formData.billing_address.first_name}
                        onChange={(e) => handleInputChange('billing_address', 'first_name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-last-name">Nom *</Label>
                      <Input
                        id="billing-last-name"
                        value={formData.billing_address.last_name}
                        onChange={(e) => handleInputChange('billing_address', 'last_name', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billing-email">Email *</Label>
                      <Input
                        id="billing-email"
                        type="email"
                        value={formData.billing_address.email}
                        onChange={(e) => handleInputChange('billing_address', 'email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-phone">Téléphone</Label>
                      <Input
                        id="billing-phone"
                        type="tel"
                        value={formData.billing_address.phone}
                        onChange={(e) => handleInputChange('billing_address', 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billing-address1">Adresse *</Label>
                    <Input
                      id="billing-address1"
                      value={formData.billing_address.address_line_1}
                      onChange={(e) => handleInputChange('billing_address', 'address_line_1', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="billing-address2">Adresse (ligne 2)</Label>
                    <Input
                      id="billing-address2"
                      value={formData.billing_address.address_line_2}
                      onChange={(e) => handleInputChange('billing_address', 'address_line_2', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billing-city">Ville *</Label>
                      <Input
                        id="billing-city"
                        value={formData.billing_address.city}
                        onChange={(e) => handleInputChange('billing_address', 'city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-postal">Code postal *</Label>
                      <Input
                        id="billing-postal"
                        value={formData.billing_address.postal_code}
                        onChange={(e) => handleInputChange('billing_address', 'postal_code', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing-country">Pays *</Label>
                      <Select
                        value={formData.billing_address.country}
                        onValueChange={(value) => handleInputChange('billing_address', 'country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Belgique">Belgique</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Adresse de livraison
                  </CardTitle>
                  <CardDescription>
                    Où souhaitez-vous recevoir votre commande ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same-as-billing"
                      checked={sameAsShipping}
                      onCheckedChange={handleSameAsShippingChange}
                    />
                    <Label htmlFor="same-as-billing">
                      Identique à l'adresse de facturation
                    </Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="shipping-first-name">Prénom *</Label>
                          <Input
                            id="shipping-first-name"
                            value={formData.shipping_address.first_name}
                            onChange={(e) => handleInputChange('shipping_address', 'first_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-last-name">Nom *</Label>
                          <Input
                            id="shipping-last-name"
                            value={formData.shipping_address.last_name}
                            onChange={(e) => handleInputChange('shipping_address', 'last_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shipping-address1">Adresse *</Label>
                        <Input
                          id="shipping-address1"
                          value={formData.shipping_address.address_line_1}
                          onChange={(e) => handleInputChange('shipping_address', 'address_line_1', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="shipping-address2">Adresse (ligne 2)</Label>
                        <Input
                          id="shipping-address2"
                          value={formData.shipping_address.address_line_2}
                          onChange={(e) => handleInputChange('shipping_address', 'address_line_2', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="shipping-city">Ville *</Label>
                          <Input
                            id="shipping-city"
                            value={formData.shipping_address.city}
                            onChange={(e) => handleInputChange('shipping_address', 'city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-postal">Code postal *</Label>
                          <Input
                            id="shipping-postal"
                            value={formData.shipping_address.postal_code}
                            onChange={(e) => handleInputChange('shipping_address', 'postal_code', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="shipping-country">Pays *</Label>
                          <Select
                            value={formData.shipping_address.country}
                            onValueChange={(value) => handleInputChange('shipping_address', 'country', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Belgique">Belgique</SelectItem>
                              <SelectItem value="Suisse">Suisse</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Mode de paiement
                  </CardTitle>
                  <CardDescription>
                    Choisissez votre mode de paiement préféré
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes de commande</CardTitle>
                  <CardDescription>
                    Informations supplémentaires pour votre commande (optionnel)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Instructions de livraison, préférences, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={orderLoading}
              >
                {orderLoading ? 'Création...' : 'Passer la commande'}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Résumé de commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={getImageUrl(item.product_image || '')}
                        alt={item.product_name || 'Produit'}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Taille: {item.variant_size} • Qté: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice((item.product_price || 0) * item.quantity)}
                    </div>
                  </div>
                ))}

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;