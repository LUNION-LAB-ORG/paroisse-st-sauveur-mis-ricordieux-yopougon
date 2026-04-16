"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button, Card, Input, Label, TextField } from "@heroui/react";

const montants = [500, 1000, 1500, 2000, 5000];

export default function FaireDon() {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const isCustom = selected === -1;

  return (
    <section className="w-full">
      <div className="text-center mb-8">
        <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-2">
          Votre soutien
        </p>
        <h2 className="text-[#2d2d83] text-2xl sm:text-3xl font-bold mb-2">
          Choisissez un montant
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Chaque don contribue au fonctionnement et au rayonnement de notre paroisse.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {montants.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setSelected(m); setCustom(""); }}
            className={`relative rounded-xl p-4 text-center font-bold text-lg transition-all border-2 ${
              selected === m
                ? "border-[#98141f] bg-[#98141f]/5 text-[#98141f]"
                : "border-gray-200 bg-white text-[#2d2d83] hover:border-[#2d2d83]/30"
            }`}
          >
            {m.toLocaleString("fr-FR")} F
            {selected === m && (
              <Heart className="absolute top-2 right-2 w-4 h-4 text-[#98141f] fill-[#98141f]" />
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelected(-1)}
          className={`rounded-xl p-4 text-center font-bold text-lg transition-all border-2 ${
            isCustom
              ? "border-[#98141f] bg-[#98141f]/5 text-[#98141f]"
              : "border-gray-200 bg-white text-[#2d2d83] hover:border-[#2d2d83]/30"
          }`}
        >
          Autre
        </button>
      </div>

      {isCustom && (
        <div className="mt-4">
          <TextField value={custom} onChange={setCustom}>
            <Label>Montant personnalisé (FCFA)</Label>
            <Input type="number" placeholder="Ex: 10 000" />
          </TextField>
        </div>
      )}
    </section>
  );
}
