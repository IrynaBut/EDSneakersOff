import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, HelpCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FloatingButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-newsletter-confirmation', {
        body: { email: email.trim() }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Inscription réussie !",
        description: "Vous avez été inscrit à notre newsletter. Vérifiez votre email pour la confirmation.",
      });
      
      setEmail("");
      setIsExpanded(false);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded && (
        <Card className="mb-2 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
                required
              />
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 w-8 p-0"
              >
                <Mail className="h-3 w-3" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col gap-1">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Mail className="w-4 h-4" />
        </Button>
        <Button
          asChild
          className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
        >
          <Link to="/faq">
            <HelpCircle className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FloatingButton;