import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'subscribe' | 'unsubscribe';
  userEmail?: string;
}

export const NewsletterModal = ({ open, onOpenChange, type, userEmail }: NewsletterModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userEmail || '');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConfirmed(true);
      
      if (type === 'subscribe') {
        toast({
          title: "Abonnement confirmé !",
          description: "Vous allez recevoir un email de confirmation de votre abonnement à la newsletter.",
        });
      } else {
        toast({
          title: "Désabonnement confirmé",
          description: "Vous avez été désabonné de notre newsletter. Un email de confirmation vous a été envoyé.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setEmail(userEmail || '');
    onOpenChange(false);
  };

  if (confirmed) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              {type === 'subscribe' ? 'Abonnement confirmé' : 'Désabonnement confirmé'}
            </DialogTitle>
            <DialogDescription>
              {type === 'subscribe' 
                ? 'Merci ! Vous recevrez bientôt un email de confirmation.'
                : 'Vous ne recevrez plus nos newsletters. Un email de confirmation vous a été envoyé.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {type === 'subscribe' ? "S'abonner à la newsletter" : 'Se désabonner de la newsletter'}
          </DialogTitle>
          <DialogDescription>
            {type === 'subscribe' 
              ? 'Recevez nos dernières nouveautés et offres exclusives.'
              : 'Confirmez votre désabonnement de notre newsletter.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={!!userEmail}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Traitement...' : (type === 'subscribe' ? "S'abonner" : 'Se désabonner')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};