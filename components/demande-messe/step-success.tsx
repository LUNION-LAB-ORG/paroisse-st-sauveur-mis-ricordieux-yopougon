import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepSuccessProps {
  onNewRequest: () => void;
}

const StepSuccess = ({ onNewRequest }: StepSuccessProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6 animate-scale-in">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-success" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Votre demande a bien été enregistrée
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Nous vous remercions pour votre confiance. Un membre de notre équipe
          paroissiale prendra contact avec vous dès que votre demande sera
          traitée. Que le Seigneur vous bénisse.
        </p>
      </div>

      <Button 
        variant="default" 
        size="lg"
        onClick={onNewRequest}
        className="mt-4"
      >
        Passer au paiement
      </Button>
    </div>
  );
};

export default StepSuccess;
