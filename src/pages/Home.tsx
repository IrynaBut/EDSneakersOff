import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowRight, 
  Truck, 
  Shield, 
  RotateCcw, 
  Star,
  Mail,
  CheckCircle
} from "lucide-react";

// Newsletter Section Component
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    
    try {
      // Call the edge function to send confirmation email
      const { error } = await supabase.functions.invoke('send-newsletter-confirmation', {
        body: { email }
      });

      if (error) throw error;
      
      setIsSubscribed(true);
      
      toast({
        title: "Inscription confirmée !",
        description: "Vous êtes maintenant inscrit à notre newsletter. Un email de confirmation vous a été envoyé.",
      });

      // Reset after 4 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 4000);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vous inscrire à la newsletter.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-12 lg:py-16 gradient-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Merci pour votre inscription !
            </h2>
            <p className="text-xl text-white/80">
              Un email de confirmation a été envoyé à <strong>{email}</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12 gradient-accent">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <Mail className="w-8 h-8 text-white mx-auto mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Restez à la Pointe de la Mode
          </h2>
          <p className="text-lg text-white/80">
            Inscrivez-vous à notre newsletter et recevez en exclusivité nos dernières nouveautés et offres spéciales.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email" 
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
              required
            />
            <Button type="submit" variant="secondary" size="lg" className="px-8" disabled={loading}>
              {loading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { products: featuredProducts, loading } = useProducts(undefined, true);

  const categories = [
    {
      name: "Collection Homme",
      href: "/homme",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Découvrez notre sélection exclusive"
    },
    {
      name: "Collection Femme", 
      href: "/femme",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Style et confort à chaque pas"
    },
    {
      name: "Collection Enfant",
      href: "/enfant", 
      image: "https://images.unsplash.com/photo-1698108223374-703700c45239?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Pour les petits aventuriers"
    }
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Livraison Gratuite",
      description: "Dès 50€ d'achat"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garantie Qualité",
      description: "Produits authentiques uniquement"
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: "Retours Gratuits",
      description: "30 jours pour changer d'avis"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Service Client",
      description: "Support 7j/7 de 9h à 18h"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden text-primary-foreground py-16 lg:py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1678266622924-c7c38ddc25e1?q=80&w=1748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
              Votre Style,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-lg">
                Nos Baskets
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto font-semibold drop-shadow-2xl">
              Découvrez notre collection exclusive de baskets premium pour toute la famille. 
              Qualité, style et confort garantis.
            </p>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-strong" asChild>
                  <Link to="/nouveautes">
                    Voir les Nouveautés
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-strong bg-white/10 border-white text-white hover:bg-white hover:text-black" asChild>
                  <Link to="/promotions">
                    Voir les Promotions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez nos collections soigneusement sélectionnées pour chaque style de vie
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/80 mb-4">{category.description}</p>
                      <Button variant="secondary" size="sm" className="group-hover:translate-x-1 transition-transform" asChild>
                        <Link to={category.href}>
                          Découvrir
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Produits Vedettes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nos coups de cœur sélectionnés spécialement pour vous
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-secondary/20 rounded-lg h-96 animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/produits">
                Voir Tous les Produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterSection />
    </div>
  );
};

export default Home;