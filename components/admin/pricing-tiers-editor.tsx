"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Label, TextField } from "@heroui/react";

export interface PricingTier {
  label: string;
  amount: number;
  description?: string;
}

interface PricingTiersEditorProps {
  tiers: PricingTier[];
  onChange: (tiers: PricingTier[]) => void;
  disabled?: boolean;
}

const DEFAULT_LABELS = ["Standard", "VIP", "VVIP", "Étudiant"];

export function PricingTiersEditor({ tiers, onChange, disabled }: PricingTiersEditorProps) {
  const addTier = () => {
    const existing = tiers.length;
    const label = DEFAULT_LABELS[existing] ?? `Tarif ${existing + 1}`;
    onChange([...tiers, { label, amount: 0, description: "" }]);
  };

  const removeTier = (index: number) => {
    onChange(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, patch: Partial<PricingTier>) => {
    onChange(tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  if (tiers.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-center">
        <p className="text-sm text-gray-500 mb-3">
          Aucun tarif défini. L&apos;événement sera considéré comme gratuit.
        </p>
        <Button
          variant="outline"
          className="rounded-xl"
          onPress={addTier}
          isDisabled={disabled}
        >
          <Plus className="w-4 h-4" /> Ajouter un tarif
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold text-[#2d2d83] uppercase tracking-wider">
              Tarif {index + 1}
            </p>
            <Button
              variant="ghost"
              className="h-7 w-7 p-0 rounded-lg text-red-500 hover:bg-red-50"
              onPress={() => removeTier(index)}
              isDisabled={disabled}
              aria-label="Retirer ce tarif"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              value={tier.label}
              onChange={(val) => updateTier(index, { label: val })}
              isDisabled={disabled}
            >
              <Label>Nom du tarif *</Label>
              <Input placeholder="Ex : Standard, VIP, VVIP" />
            </TextField>

            <TextField
              value={String(tier.amount)}
              onChange={(val) => updateTier(index, { amount: Number(val) || 0 })}
              isDisabled={disabled}
            >
              <Label>Montant (XOF) *</Label>
              <Input type="number" inputMode="numeric" placeholder="Ex : 5000" />
            </TextField>
          </div>

          <TextField
            value={tier.description ?? ""}
            onChange={(val) => updateTier(index, { description: val })}
            isDisabled={disabled}
          >
            <Label>Description (optionnel)</Label>
            <Input placeholder="Ex : Accès VIP avec rafraîchissements" />
          </TextField>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full rounded-xl"
        onPress={addTier}
        isDisabled={disabled}
      >
        <Plus className="w-4 h-4" /> Ajouter un autre tarif
      </Button>
    </div>
  );
}
