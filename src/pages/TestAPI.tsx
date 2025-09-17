import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  Database, 
  ShoppingCart, 
  User, 
  CreditCard,
  TestTube,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
  duration?: number;
}

const TestAPI = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const { addToCart, items: cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { products } = useProducts();

  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testUser, setTestUser] = useState({
    email: `test${Date.now()}@example.com`,
    password: 'testPassword123'
  });

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (name: string, updates: Partial<TestResult>) => {
    setResults(prev => prev.map(r => 
      r.name === name ? { ...r, ...updates } : r
    ));
  };

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    addResult({ name, status: 'pending', message: 'En cours...', data: null });
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      updateResult(name, {
        status: 'success',
        message: 'Succès',
        data: result,
        duration
      });
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateResult(name, {
        status: 'error',
        message: error.message || 'Erreur inconnue',
        data: error,
        duration
      });
      throw error;
    }
  };

  // Test Authentication
  const testAuth = async () => {
    setLoading(true);
    try {
      // Test Signup
      await runTest('Inscription utilisateur', async () => {
        const { error } = await signUp(testUser.email, testUser.password, {
          first_name: 'Test',
          last_name: 'User'
        });
        if (error) throw error;
        return { email: testUser.email };
      });

      // Wait a bit for signup to process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test Signin
      await runTest('Connexion utilisateur', async () => {
        const { error } = await signIn(testUser.email, testUser.password);
        if (error) throw error;
        return { email: testUser.email };
      });

    } catch (error) {
      console.error('Auth test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Products CRUD
  const testProducts = async () => {
    setLoading(true);
    try {
      // Test Read Products
      await runTest('Lecture des produits', async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .limit(5);
        
        if (error) throw error;
        return { count: data?.length || 0, products: data };
      });

      // Test Products by Category
      await runTest('Filtrage par genre (homme)', async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('gender', 'homme')
          .limit(3);
        
        if (error) throw error;
        return { count: data?.length || 0 };
      });

      // Test Product Variants
      await runTest('Lecture des variantes de produit', async () => {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .limit(10);
        
        if (error) throw error;
        return { count: data?.length || 0, variants: data };
      });

    } catch (error) {
      console.error('Products test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Cart Operations
  const testCart = async () => {
    if (!user) {
      addResult({
        name: 'Test du panier',
        status: 'error',
        message: 'Utilisateur non connecté'
      });
      return;
    }

    setLoading(true);
    try {
      // Clear cart first
      await runTest('Vider le panier', async () => {
        await clearCart();
        return { message: 'Panier vidé' };
      });

      // Add to cart
      if (products.length > 0 && products[0].variants && products[0].variants.length > 0) {
        await runTest('Ajouter au panier', async () => {
          const product = products[0];
          const variant = product.variants![0];
          await addToCart(product.id, variant.id, 2);
          return { 
            product: product.name, 
            variant: variant.size,
            quantity: 2
          };
        });

        // Test cart content
        await runTest('Vérifier contenu du panier', async () => {
          return { 
            itemCount: cartItems.length,
            items: cartItems.map(item => ({
              product: item.product_name,
              quantity: item.quantity
            }))
          };
        });
      }

    } catch (error) {
      console.error('Cart test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Orders
  const testOrders = async () => {
    if (!user) {
      addResult({
        name: 'Test des commandes',
        status: 'error',
        message: 'Utilisateur non connecté'
      });
      return;
    }

    setLoading(true);
    try {
      // Test create order (only if cart has items)
      if (cartItems.length > 0) {
        await runTest('Créer une commande', async () => {
          const orderData = {
            billing_address: {
              first_name: 'Test',
              last_name: 'User',
              email: testUser.email,
              address_line_1: '123 Test Street',
              city: 'Test City',
              postal_code: '12345',
              country: 'France'
            },
            shipping_address: {
              first_name: 'Test',
              last_name: 'User',
              address_line_1: '123 Test Street',
              city: 'Test City',
              postal_code: '12345',
              country: 'France'
            },
            payment_method: 'card'
          };

          const { order, error } = await createOrder(orderData);
          if (error) throw new Error(error);
          return { 
            orderId: order?.id,
            orderNumber: order?.order_number,
            total: order?.total_amount
          };
        });
      }

      // Test read orders
      await runTest('Lire les commandes', async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .limit(5);
        
        if (error) throw error;
        return { count: data?.length || 0, orders: data };
      });

    } catch (error) {
      console.error('Orders test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Payments
  const testPayments = async () => {
    if (!user) {
      addResult({
        name: 'Test des paiements',
        status: 'error',
        message: 'Utilisateur non connecté'
      });
      return;
    }

    setLoading(true);
    try {
      // Test read payments
      await runTest('Lire les paiements', async () => {
        const { data, error } = await supabase
          .from('payments')
          .select(`
            *,
            orders (
              order_number,
              total_amount
            )
          `)
          .limit(5);
        
        if (error) throw error;
        return { count: data?.length || 0, payments: data };
      });

    } catch (error) {
      console.error('Payments test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    setResults([]);
    await testAuth();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for auth
    await testProducts();
    await testCart();
    await testOrders();
    await testPayments();
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            Tests API Espace Diop Nation
          </h1>
          <p className="text-muted-foreground">
            Suite de tests pour vérifier le bon fonctionnement de tous les endpoints et fonctionnalités
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contrôles de test</CardTitle>
                <CardDescription>
                  Exécutez les tests individuellement ou tous ensemble
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    onClick={runAllTests} 
                    disabled={loading}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Tous les tests
                  </Button>
                  
                  <Separator />
                  
                  <Button 
                    onClick={testAuth} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Auth
                  </Button>
                  
                  <Button 
                    onClick={testProducts} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Produits
                  </Button>
                  
                  <Button 
                    onClick={testCart} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Panier
                  </Button>
                  
                  <Button 
                    onClick={testOrders} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Commandes
                  </Button>
                  
                  <Button 
                    onClick={testPayments} 
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Paiements
                  </Button>
                  
                  <Separator />
                  
                  <Button 
                    onClick={clearResults} 
                    variant="ghost"
                    size="sm"
                  >
                    Effacer résultats
                  </Button>
                </div>

                {user && (
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      Connecté en tant que: {user.email}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Résultats des tests</CardTitle>
                <CardDescription>
                  {results.length === 0 
                    ? 'Aucun test exécuté' 
                    : `${results.length} tests exécutés - ${results.filter(r => r.status === 'success').length} succès, ${results.filter(r => r.status === 'error').length} erreurs`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {results.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Cliquez sur un bouton pour exécuter des tests</p>
                      </div>
                    ) : (
                      results.map((result, index) => (
                        <Card key={index} className="border-l-4" style={{
                          borderLeftColor: result.status === 'success' ? '#10b981' : 
                                          result.status === 'error' ? '#ef4444' : '#f59e0b'
                        }}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2">
                                {getStatusIcon(result.status)}
                                {result.name}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {result.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.duration}ms
                                  </Badge>
                                )}
                                <Badge 
                                  variant={result.status === 'success' ? 'default' : 
                                          result.status === 'error' ? 'destructive' : 'secondary'}
                                >
                                  {result.status === 'success' ? 'Succès' : 
                                   result.status === 'error' ? 'Erreur' : 'En cours'}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-2">
                              {result.message}
                            </p>
                            {result.data && (
                              <details className="text-xs">
                                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                  Voir les données
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;