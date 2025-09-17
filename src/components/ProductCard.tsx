import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  sizes: string[];
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  rating = 5,
  isNew = false,
  isOnSale = false,
  sizes 
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card 
      className="group cursor-pointer shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary/20">
          <Link to={`/produit/${id}`}>
            <img 
              src={image} 
              alt={name}
              className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Nouveau
              </Badge>
            )}
            {isOnSale && discount > 0 && (
              <Badge variant="destructive">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <Button
              variant="secondary"
              size="sm"
              className="w-8 h-8 p-0 bg-background/80 hover:bg-background shadow-soft"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart 
                className={`h-4 w-4 ${isWishlisted ? 'fill-accent text-accent' : 'text-foreground'}`} 
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-8 h-8 p-0 bg-background/80 hover:bg-background shadow-soft"
              asChild
            >
              <Link to={`/produit/${id}`}>
                <Eye className="h-4 w-4 text-foreground" />
              </Link>
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <Button 
              variant="default" 
              className="w-full shadow-soft"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>

          <Link to={`/produit/${id}`}>
            <h3 className="font-medium text-sm hover:text-accent transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">
                {price.toFixed(2)} €
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {originalPrice.toFixed(2)} €
                </span>
              )}
            </div>
          </div>

          {/* Available Sizes */}
          <div className="flex flex-wrap gap-1">
            {sizes.slice(0, 4).map((size) => (
              <Badge 
                key={size} 
                variant="outline" 
                className="text-xs px-2 py-0 h-5"
              >
                {size}
              </Badge>
            ))}
            {sizes.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                +{sizes.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;