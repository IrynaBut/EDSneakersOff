import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="ED Sneakers" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Votre destination premium pour les baskets de qualité. 
              Découvrez notre collection exclusive pour homme, femme et enfant.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Boutique</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/homme" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Collection Homme
                </Link>
              </li>
              <li>
                <Link to="/femme" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Collection Femme
                </Link>
              </li>
              <li>
                <Link to="/enfant" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Collection Enfant
                </Link>
              </li>
              <li>
                <Link to="/nouveautes" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Nous Contacter
                </Link>
              </li>
              <li>
                <Link to="/livraison" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Livraison & Retours
                </Link>
              </li>
              <li>
                <Link to="/guide-tailles" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Guide des Tailles
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/mon-compte" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Mon Compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-primary-foreground/80">
              Inscrivez-vous pour recevoir nos dernières offres et nouveautés.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Votre email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="pt-4 space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@edsneakers.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-primary-foreground/80">
            © {currentYear} ED Sneakers. Tous droits réservés.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="/mentions-legales" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Mentions Légales
            </Link>
            <Link to="/cgv" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              CGV
            </Link>
            <Link to="/politique-confidentialite" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/cookies" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;