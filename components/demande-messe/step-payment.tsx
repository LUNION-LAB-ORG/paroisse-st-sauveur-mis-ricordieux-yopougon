import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { IntentionFormData } from "@/services/messes/messes.schema";


interface StepPaymentProps {
  data: IntentionFormData;
  onChange: (field: keyof IntentionFormData, value: number) => void;
}

const intentionLabels: Record<string, string> = {
  "action-de-grace": "Action de grâce",
  "repos-ame": "Repos de l'âme",
  "guerison": "Guérison",
  "protection": "Protection",
  "benediction": "Bénédiction",
  "autre": "Autre",
};

const StepPayment = ({ data, onChange }: StepPaymentProps) => {
  const selectedDate = data.date_at ? parseISO(data.date_at) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Paiement & Confirmation</h3>
        <p className="text-sm text-muted-foreground">
          Vérifiez les informations et confirmez le montant
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Montant (FCFA) *</Label>
          <Input
            id="amount"
            type="number"
            min={1}
            placeholder="2000"
            value={data.amount}
            onChange={(e) => onChange("amount", Number(e.target.value))}
            className="bg-card"
          />
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="font-medium text-sm text-foreground mb-3">
            Récapitulatif de votre demande
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type d&apos;intention</span>
              <span className="font-medium">{intentionLabels[data.type] || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Message</span>
              <span className="font-medium max-w-[200px] text-right truncate">
                {data.message || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Demandeur</span>
              <span className="font-medium">{data.fullname || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone</span>
              <span className="font-medium">{data.phone || "-"}</span>
            </div>
            {data.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{data.email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date souhaitée</span>
              <span className="font-medium">
                {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horaire</span>
              <span className="font-medium">{data.time_at || "-"}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Montant</span>
              <span className="font-semibold text-foreground">{data.amount} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPayment;
