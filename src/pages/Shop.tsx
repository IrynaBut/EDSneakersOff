import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ProductCard from "@/components/ProductCard";
import { 
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown
} from "lucide-react";

const Shop = ({ category }: { category?: string }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Mock data - will be replaced with real data when Supabase is connected
  const products = [
    {
      id: "1",
      name: "Air Max Classic Vintage",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      category: "Homme",
      rating: 5,
      isNew: false,
      isOnSale: true,
      sizes: ["39", "40", "41", "42", "43", "44"]
    },
    {
      id: "2", 
      name: "Running Pro Women's Edition",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
      category: "Femme",
      rating: 5,
      isNew: true,
      isOnSale: false,
      sizes: ["36", "37", "38", "39", "40", "41"]
    },
    {
      id: "3",
      name: "Kids Adventure Sneakers",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop", 
      category: "Enfant",
      rating: 4,
      isNew: true,
      isOnSale: false,
      sizes: ["28", "29", "30", "31", "32", "33", "34", "35"]
    },
    {
      id: "4",
      name: "Urban Street High-Top",
      price: 189.99,
      originalPrice: 229.99,
      image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&h=400&fit=crop",
      category: "Homme", 
      rating: 5,
      isNew: false,
      isOnSale: true,
      sizes: ["40", "41", "42", "43", "44", "45"]
    },
    {
      id: "5",
      name: "Classic White Leather",
      price: 119.99,
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
      category: "Femme",
      rating: 4,
      isNew: false,
      isOnSale: false,
      sizes: ["36", "37", "38", "39", "40", "41", "42"]
    },
    {
      id: "6",
      name: "Sport Performance Max",
      price: 169.99,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
      category: "Homme",
      rating: 5,
      isNew: true,
      isOnSale: false,
      sizes: ["39", "40", "41", "42", "43", "44", "45"]
    }
  ];

  const sizes = ["28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
  const brands = ["Nike", "Adidas", "Puma", "New Balance", "Converse", "Vans"];

  const categoryTitle = category ? 
    (category === "homme" ? "Collection Homme" :
     category === "femme" ? "Collection Femme" :
     category === "enfant" ? "Collection Enfant" : "Tous les Produits") 
    : "Tous les Produits";

  const filteredProducts = category ? 
    products.filter(p => p.category.toLowerCase() === category) : 
    products;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryTitle}</h1>
            <p className="text-xl text-muted-foreground">
              Découvrez notre sélection de baskets premium
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filtres</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Prix</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={300}
                      min={0}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Sizes */}
                  <div>
                    <h4 className="font-medium mb-3">Tailles</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSizes([...selectedSizes, size]);
                              } else {
                                setSelectedSizes(selectedSizes.filter(s => s !== size));
                              }
                            }}
                          />
                          <label htmlFor={`size-${size}`} className="text-sm">
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Brands */}
                  <div>
                    <h4 className="font-medium mb-3">Marques</h4>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                              }
                            }}
                          />
                          <label htmlFor={`brand-${brand}`} className="text-sm">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Mis en avant</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                    <SelectItem value="newest">Plus récent</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Display */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;