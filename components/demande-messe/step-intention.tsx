import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IntentionFormData } from "@/services/messes/messes.schema";


interface StepIntentionProps {
  data: {
    type: string;
    message: string;
  };
  onChange: (field: keyof IntentionFormData, value: string) => void;
}

const StepIntention = ({ data, onChange }: StepIntentionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Type d&apos;intention</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez le type d&apos;intention
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={data.type}
            onValueChange={(value) => onChange("type", value)}
          >
            <SelectTrigger id="type" className="bg-card">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="action-de-grace">Action de grâce</SelectItem>
              <SelectItem value="repos-ame">Repos de l&apos;âme</SelectItem>
              <SelectItem value="guerison">Guérison</SelectItem>
              <SelectItem value="protection">Protection</SelectItem>
              <SelectItem value="benediction">Bénédiction</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Décrivez votre intention..."
            value={data.message}
            onChange={(e) => onChange("message", e.target.value)}
            className="min-h-[120px] bg-card resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StepIntention;
