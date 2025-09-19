import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Truck, MapPin, Lock, Calendar, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/hooks/useOrders";
import { PickupPointModal } from "@/components/PickupPointModal";
import { OrderConfirmationModal } from "@/components/OrderConfirmationModal";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour passer commande.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);
  
  const [formData, setFormData] = useState({
    // Shipping
    shippingType: 'home', // 'home' or 'pickup'
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    // Billing (separate from shipping)
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'France',
    sameBillingAddress: true,
    // Payment
    paymentMethod: 'card',
    notes: '',
    cgvAccepted: false,
    // Payment fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(null);
  const [pickupPointModal, setPickupPointModal] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{ open: boolean; order: any } | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cgvAccepted) {
      toast({
        title: "Conditions générales non acceptées",
        description: "Vous devez accepter les conditions générales de vente pour continuer.",
        variant: "destructive"
      });
      return;
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast({
          title: "Informations de paiement incomplètes",
          description: "Veuillez remplir tous les champs de la carte bancaire.",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);

    try {
      // Handle PayPal redirection
      if (formData.paymentMethod === 'paypal') {
        // Redirect to PayPal
        const paypalUrl = `https://www.paypal.com/checkoutnow?token=${Date.now()}&amount=${totalAmount}&currency=EUR`;
        window.location.href = paypalUrl;
        return;
      }

      // Create order data
      let shipping_address;
      
      if (formData.shippingType === 'pickup' && selectedPickupPoint) {
        shipping_address = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_line_1: selectedPickupPoint.name,
          address_line_2: selectedPickupPoint.address,
          city: selectedPickupPoint.city,
          postal_code: selectedPickupPoint.postalCode,
          country: 'France',
          is_pickup_point: true
        };
      } else {
        shipping_address = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_line_1: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          is_pickup_point: false
        };
      }

      const billing_address = formData.sameBillingAddress ? {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_line_1: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country
      } : {
        first_name: formData.billingFirstName,
        last_name: formData.billingLastName,
        email: formData.billingEmail,
        phone: formData.billingPhone,
        address_line_1: formData.billingAddress,
        city: formData.billingCity,
        postal_code: formData.billingPostalCode,
        country: formData.billingCountry
      };

      const orderData = {
        shipping_address,
        billing_address,
        payment_method: formData.paymentMethod,
        notes: formData.notes
      };

      // Create the order
      const { order, error } = await createOrder(orderData);
      
      if (error || !order) {
        throw new Error(error || 'Erreur lors de la création de la commande');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      await clearCart();
      
      // Show confirmation modal
      setOrderConfirmation({ open: true, order });
      
      toast({
        title: "Votre commande a été validée !",
        description: `Commande #${order.order_number} confirmée. Vous allez recevoir un email de confirmation avec tous les détails.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors du paiement",
        description: error.message || "Une erreur est survenue lors du traitement de votre commande.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits à votre panier avant de passer commande.
            </p>
            <Button asChild>
              <Link to="/">
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Finaliser votre Commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2" />
                      Type de Livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup 
                      value={formData.shippingType} 
                      onValueChange={(value) => handleInputChange('shippingType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home">Livraison à domicile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup">Point Relais</Label>
                      </div>
                    </RadioGroup>

                    {formData.shippingType === 'pickup' && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Point Relais sélectionné</p>
                            {selectedPickupPoint ? (
                              <div className="text-sm text-muted-foreground">
                                <p className="font-medium">{selectedPickupPoint.name}</p>
                                <p>{selectedPickupPoint.address}</p>
                                <p>{selectedPickupPoint.postalCode} {selectedPickupPoint.city}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Aucun point sélectionné</p>
                            )}
                          </div>
                          <Button variant="outline" onClick={() => setPickupPointModal(true)}>
                            <Package className="w-4 h-4 mr-2" />
                            {selectedPickupPoint ? 'Changer' : 'Choisir'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {formData.shippingType === 'home' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Adresse de Livraison
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Adresse *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="city">Ville *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Code Postal *</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Adresse de Facturation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameBilling" 
                        checked={formData.sameBillingAddress}
                        onCheckedChange={(checked) => handleInputChange('sameBillingAddress', checked as boolean)}
                      />
                      <Label htmlFor="sameBilling">
                        Identique à l'adresse de livraison
                      </Label>
                    </div>

                    {!formData.sameBillingAddress && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">Prénom *</Label>
                            <Input
                              id="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Nom *</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingEmail">Email *</Label>
                            <Input
                              id="billingEmail"
                              type="email"
                              value={formData.billingEmail}
                              onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingPhone">Téléphone</Label>
                            <Input
                              id="billingPhone"
                              type="tel"
                              value={formData.billingPhone}
                              onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billingAddress">Adresse *</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="billingCity">Ville *</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange('billingCity', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingPostalCode">Code Postal *</Label>
                            <Input
                              id="billingPostalCode"
                              value={formData.billingPostalCode}
                              onChange={(e) => handleInputChange('billingPostalCode', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Méthode de Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Carte bancaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 mt-4 p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="cardName">Nom sur la carte *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          placeholder="Jean DUPONT"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date d'expiration *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            placeholder="MM/AA"
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="123"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span>Paiement sécurisé SSL</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notes de Commande</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Instructions spéciales pour la livraison..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Récapitulatif de Commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Taille: {item.variant_size} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{(item.product_price || 0) * item.quantity}€</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Livraison
                    </span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{totalAmount}€</span>
                  </div>

                  {/* CGV Acceptance */}
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="cgv" 
                      checked={formData.cgvAccepted}
                      onCheckedChange={(checked) => handleInputChange('cgvAccepted', checked as boolean)}
                    />
                    <Label htmlFor="cgv" className="text-sm leading-4">
                      J'accepte les{' '}
                      <Link to="/cgv" className="text-primary underline">
                        Conditions Générales de Vente
                      </Link>
                      {' '}et confirme avoir lu la{' '}
                      <Link to="/politique-confidentialite" className="text-primary underline">
                        Politique de Confidentialité
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading || !formData.cgvAccepted}
                  >
                    {loading ? "Traitement du paiement..." : `Confirmer le Paiement - ${totalAmount}€`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Paiement sécurisé par SSL. Vos données sont protégées.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
        
        {/* Pickup Point Modal */}
        <PickupPointModal
          open={pickupPointModal}
          onOpenChange={setPickupPointModal}
          onSelectPoint={setSelectedPickupPoint}
          selectedPoint={selectedPickupPoint}
        />
        
        {/* Order Confirmation Modal */}
        {orderConfirmation && (
          <OrderConfirmationModal
            open={orderConfirmation.open}
            onOpenChange={() => setOrderConfirmation(null)}
            order={orderConfirmation.order}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;