import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IntentionFormData } from "@/services/messes/messes.schema";


interface StepCoordinatesProps {
  data: {
    fullname: string;
    email: string | null | undefined;
    phone: string;
  };
  onChange: (field: keyof IntentionFormData, value: string | null) => void;
}

const StepCoordinates = ({ data, onChange }: StepCoordinatesProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Vos coordonnées</h3>
        <p className="text-sm text-muted-foreground">
          Nom et prénom du demandeur
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">Nom complet *</Label>
          <Input
            id="fullname"
            placeholder="Votre nom et prénom"
            value={data.fullname}
            onChange={(e) => onChange("fullname", e.target.value)}
            className="bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Numéro de téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 00 00 00 00"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail (optionnel)</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={data.email || ""}
            onChange={(e) => onChange("email", e.target.value || null)}
            className="bg-card"
          />
        </div>
      </div>
    </div>
  );
};

export default StepCoordinates;
