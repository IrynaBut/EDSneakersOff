import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        asChild
        className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
      >
        <Link to="/faq">
          <HelpCircle className="w-3 h-3" />
        </Link>
      </Button>
    </div>
  );
};

export default FloatingButton;