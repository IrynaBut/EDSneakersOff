import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronRight, HelpCircle, Send } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [questionForm, setQuestionForm] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const faqItems = [
    {
      id: "1",
      question: "Comment suivre ma commande ?",
      answer: "Vous recevrez un email avec un numéro de suivi dès l'expédition de votre commande. Vous pouvez également consulter le statut dans votre espace client."
    },
    {
      id: "2", 
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, MasterCard, American Express) et les virements bancaires sécurisés."
    },
    {
      id: "3",
      question: "Quels sont les délais de livraison ?", 
      answer: "Les délais de livraison sont de 5 à 7 jours ouvrés pour la France métropolitaine. La livraison est gratuite dès 50€ d'achat."
    },
    {
      id: "4",
      question: "Comment retourner un produit ?",
      answer: "Vous pouvez initier un retour dans la section 'Mon compte' de notre site. Vous avez 30 jours pour retourner un produit non conforme ou qui ne vous convient pas."
    },
    {
      id: "5",
      question: "Comment choisir ma taille ?",
      answer: "Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, contactez notre service client qui vous aidera à choisir."
    },
    {
      id: "6",
      question: "Les produits sont-ils authentiques ?",
      answer: "Oui, tous nos produits sont 100% authentiques et proviennent directement des marques officielles. Nous garantissons l'authenticité de tous nos articles."
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.name || !questionForm.email || !questionForm.question) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Question envoyée !",
        description: "Nous vous répondrons par email dans les plus brefs délais.",
      });

      setQuestionForm({ name: '', email: '', question: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre question.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-xl text-muted-foreground">
              Trouvez rapidement des réponses à vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {faqItems.map((item) => (
                <Card key={item.id}>
                  <Collapsible 
                    open={openItems.includes(item.id)}
                    onOpenChange={() => toggleItem(item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                        <CardTitle className="flex items-center justify-between text-left">
                          <span className="flex items-center">
                            <HelpCircle className="w-5 h-5 mr-3 text-primary" />
                            {item.question}
                          </span>
                          {openItems.includes(item.id) ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Poser une Question
                  </CardTitle>
                  <CardDescription>
                    Votre question ne figure pas dans notre FAQ ? Contactez-nous directement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Votre nom"
                        value={questionForm.name}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={questionForm.email}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Votre question..."
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Envoi..." : "Envoyer la Question"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;