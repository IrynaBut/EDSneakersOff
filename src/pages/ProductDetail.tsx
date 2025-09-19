import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Star, Truck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  brand?: string;
  gender: string;
  main_image_url?: string;
  images?: string[];
  product_variants: Array<{
    id: string;
    size: string;
    color?: string;
    stock_quantity: number;
  }>;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_variants (
              id,
              size,
              color,
              stock_quantity
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le produit",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const variant = product?.product_variants.find(v => v.size === size);
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Choisissez une taille avant d'ajouter au panier",
        variant: "destructive"
      });
      return;
    }

    if (selectedVariant.stock_quantity === 0) {
      toast({
        title: "Rupture de stock",
        description: "Cette taille n'est plus disponible",
        variant: "destructive"
      });
      return;
    }

    await addToCart(product.id, selectedVariant.id, 1);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} - Taille ${selectedSize}`,
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://hsvfgfmvdymwcevisyhh.supabase.co/storage/v1/object/public/product-images/${imagePath}`;
  };

  const images = product ? [
    getImageUrl(product.main_image_url || ''),
    ...(product.images || []).map(img => getImageUrl(img))
  ].filter(Boolean) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    );
  }

  const isOnSale = product.original_price && product.original_price > product.price;
  const discountPercent = isOnSale 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={images[currentImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {isOnSale && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{discountPercent}%
                </Badge>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-muted-foreground text-lg">{product.brand}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8/5 - 2 avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold">{product.price}€</span>
              {isOnSale && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.original_price}€
                </span>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Taille</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedSize === variant.size ? "default" : "outline"}
                    onClick={() => handleSizeSelect(variant.size)}
                    disabled={variant.stock_quantity === 0}
                    className="h-12"
                  >
                    {variant.size}
                    {variant.stock_quantity === 0 && (
                      <span className="ml-1 text-xs">(Épuisé)</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
                disabled={!selectedVariant || selectedVariant?.stock_quantity === 0}
              >
                Ajouter au panier - {product.price}€
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  if (product && isFavorite(product.id)) {
                    removeFromFavorites(product.id);
                  } else if (product) {
                    addToFavorites(product.id);
                  }
                }}
              >
                <Heart className={`w-5 h-5 ${product && isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">Livraison gratuite dès 50€</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-sm">Retours gratuits sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="size-guide">Guide des tailles</TabsTrigger>
              <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description du produit</h3>
                  <div className="prose prose-sm max-w-none">
                    {product.name.toLowerCase().includes('vans') && product.name.toLowerCase().includes('old skool') ? (
                      <>
                        <p className="mb-4">Vans Old Skool – iconic sneaker for women.</p>
                        <ul className="space-y-2">
                          <li>• Premium materials selected for durability</li>
                          <li>• Ultra-comfortable sole for extended wear</li>
                          <li>• Modern and trendy design</li>
                          <li>• Advanced cushioning technology</li>
                          <li>• Available in multiple sizes</li>
                          <li>• Perfect for both sports and everyday use</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">{product.description || "Sneaker de haute qualité alliant style et confort. Parfaite pour un usage quotidien ou sportif."}</p>
                        <ul className="space-y-2">
                          <li>• Matériaux premium sélectionnés pour leur durabilité</li>
                          <li>• Semelle ultra-confortable pour un port prolongé</li>
                          <li>• Design moderne et tendance</li>
                          <li>• Technologie avancée d'amorti</li>
                          <li>• Disponible en plusieurs tailles</li>
                          <li>• Parfait pour le sport et le quotidien</li>
                        </ul>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="size-guide" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Guide des tailles</h3>
                  <div className="overflow-x-auto flex justify-center">
                    <table className="border-collapse border border-border">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="border-r border-border p-3 text-center w-20">EU</th>
                          <th className="border-r border-border p-3 text-center w-20">US</th>
                          <th className="border-r border-border p-3 text-center w-20">UK</th>
                          <th className="p-3 text-center w-32">Longueur (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">39</td>
                          <td className="border-r border-border p-3 text-center">6.5</td>
                          <td className="border-r border-border p-3 text-center">6</td>
                          <td className="p-3 text-center">24.5</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">40</td>
                          <td className="border-r border-border p-3 text-center">7</td>
                          <td className="border-r border-border p-3 text-center">6.5</td>
                          <td className="p-3 text-center">25</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">41</td>
                          <td className="border-r border-border p-3 text-center">7.5</td>
                          <td className="border-r border-border p-3 text-center">7</td>
                          <td className="p-3 text-center">25.5</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">42</td>
                          <td className="border-r border-border p-3 text-center">8</td>
                          <td className="border-r border-border p-3 text-center">7.5</td>
                          <td className="p-3 text-center">26</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">43</td>
                          <td className="border-r border-border p-3 text-center">9</td>
                          <td className="border-r border-border p-3 text-center">8.5</td>
                          <td className="p-3 text-center">27</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="border-r border-border p-3 text-center">44</td>
                          <td className="border-r border-border p-3 text-center">10</td>
                          <td className="border-r border-border p-3 text-center">9.5</td>
                          <td className="p-3 text-center">28</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Avis clients</h3>
                  <div className="space-y-4">
                    {/* Product-specific reviews based on product name */}
                    {product.name.toLowerCase().includes('vans') && product.name.toLowerCase().includes('old skool') ? (
                      <>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-medium">Emma D.</span>
                            <span className="text-sm text-muted-foreground">Il y a 1 semaine</span>
                          </div>
                          <p className="text-sm">Les Vans Old Skool sont parfaites ! Super confortables pour marcher toute la journée, le style iconique se marie avec tout. Qualité au top comme toujours avec Vans.</p>
                        </div>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                              <Star className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Léa M.</span>
                            <span className="text-sm text-muted-foreground">Il y a 3 semaines</span>
                          </div>
                          <p className="text-sm">Très satisfaite de mon achat ! La semelle est vraiment confortable et les matériaux semblent durables. Le design classique ne se démode jamais.</p>
                        </div>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-medium">Sophie R.</span>
                            <span className="text-sm text-muted-foreground">Il y a 1 mois</span>
                          </div>
                          <p className="text-sm">Je porte des Vans depuis des années et ces Old Skool sont un incontournable ! Parfaites pour le quotidien et le sport. Je recommande vivement.</p>
                        </div>
                      </>
                    ) : product.name.toLowerCase().includes('nike') ? (
                      <>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-medium">Julie T.</span>
                            <span className="text-sm text-muted-foreground">Il y a 5 jours</span>
                          </div>
                          <p className="text-sm">Excellente basket Nike ! L'amorti est parfait pour mes séances de sport. La qualité de fabrication est irréprochable.</p>
                        </div>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                              <Star className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Marine K.</span>
                            <span className="text-sm text-muted-foreground">Il y a 2 semaines</span>
                          </div>
                          <p className="text-sm">Très bonne chaussure pour le running. Le maintien du pied est excellent et le design est moderne. Je recommande !</p>
                        </div>
                      </>
                    ) : product.name.toLowerCase().includes('adidas') ? (
                      <>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-medium">Clara B.</span>
                            <span className="text-sm text-muted-foreground">Il y a 4 jours</span>
                          </div>
                          <p className="text-sm">Super qualité Adidas ! Très confortable, parfaite pour le sport et la ville. Les 3 bandes iconiques donnent du style à toutes mes tenues.</p>
                        </div>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                              <Star className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Anaïs L.</span>
                            <span className="text-sm text-muted-foreground">Il y a 10 jours</span>
                          </div>
                          <p className="text-sm">Très satisfaite de ces Adidas. La taille correspond bien et la qualité est au rendez-vous. Parfaites pour mes entraînements.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-medium">Marie L.</span>
                            <span className="text-sm text-muted-foreground">Il y a 2 semaines</span>
                          </div>
                          <p className="text-sm">Excellent produit, très confortable et de qualité. Je recommande vivement pour l'usage quotidien !</p>
                        </div>
                        <div className="border-b border-border pb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                              ))}
                              <Star className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Pierre M.</span>
                            <span className="text-sm text-muted-foreground">Il y a 1 mois</span>
                          </div>
                          <p className="text-sm">Très beau design et finitions soignées. La taille correspond parfaitement. Livraison rapide et soignée.</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      Voir plus d'avis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;