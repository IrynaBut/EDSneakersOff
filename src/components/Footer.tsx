import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
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
import { SupportModal } from "./SupportModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [supportModal, setSupportModal] = useState<{
    open: boolean;
    type: 'delivery' | 'support' | 'faq' | 'legal' | 'cgv' | 'privacy' | 'cookies' | 'size-guide';
  }>({ open: false, type: 'support' });

  const openSupportModal = (type: typeof supportModal.type) => {
    setSupportModal({ open: true, type });
  };
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="space-y-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="EDSneakers" className="h-8 w-auto brightness-0 invert" />
          </Link>
            <p className="text-sm text-primary-foreground/80">
              Votre destination premium pour les baskets de qualité. 
              Découvrez notre collection exclusive pour homme, femme et enfant.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://www.facebook.com/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://x.com/?lang=fr" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-2">
            <h3 className="font-semibold">Boutique</h3>
            <ul className="space-y-1 text-sm">
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
          <div className="space-y-2">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <button 
                  onClick={() => openSupportModal('support')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                >
                  Nous Contacter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openSupportModal('delivery')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                >
                  Livraison & Retours
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openSupportModal('size-guide')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                >
                  Guide des Tailles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openSupportModal('faq')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/profile" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Mon Compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h3 className="font-semibold">Nous Contacter</h3>
            <div className="space-y-1 text-sm text-primary-foreground/80">
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

        <Separator className="my-4 bg-primary-foreground/20" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-primary-foreground/80">
            © {currentYear} ED Sneakers. Tous droits réservés.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link 
              to="/mentions-legales"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Mentions Légales
            </Link>
            <Link 
              to="/cgv"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              CGV
            </Link>
            <Link 
              to="/politique-confidentialite"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Politique de Confidentialité
            </Link>
            <Link 
              to="/politique-cookies"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SupportModal 
        open={supportModal.open} 
        onOpenChange={(open) => setSupportModal(prev => ({ ...prev, open }))}
        type={supportModal.type}
      />
    </footer>
  );
};

export default Footer;