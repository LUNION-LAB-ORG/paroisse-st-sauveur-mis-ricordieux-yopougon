import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { IntentionFormData } from "@/services/messes/messes.schema";


interface StepDateTimeProps {
  data: {
    date_at: string;
    time_at: string;
  };
  onChange: (field: keyof IntentionFormData, value: string) => void;
}

const StepDateTime = ({ data, onChange }: StepDateTimeProps) => {
  const selectedDate = data.date_at ? parseISO(data.date_at) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange("date_at", date.toISOString());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary">Date et heure souhaitées</h3>
        <p className="text-sm text-muted-foreground">
          Choisissez la date et l&apos;heure de la messe
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Date de la messe *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-card",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionnez une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time_at">Horaire de messe *</Label>
          <Select
            value={data.time_at}
            onValueChange={(value) => onChange("time_at", value)}
          >
            <SelectTrigger id="time_at" className="bg-card">
              <SelectValue placeholder="Sélectionnez un horaire" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="08:00">08h00</SelectItem>
              <SelectItem value="10:00">10h00</SelectItem>
              <SelectItem value="12:00">12h00</SelectItem>
              <SelectItem value="18:00">18h00</SelectItem>
              <SelectItem value="19:00">19h00</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepDateTime;
