"use client";

import type { IService } from "@/features/service/types/service.type";

import { Card, Input, Label, ListBox, Select, TextField } from "@heroui/react";

export const CATEGORIES_MOUVEMENT = [
  "Liturgie",
  "Prière",
  "Jeunesse",
  "Charité",
  "Familles",
  "Autre",
] as const;

const STATUTS = [
  { id: "published", label: "Publié" },
  { id: "draft", label: "Brouillon" },
  { id: "hidden", label: "Masqué" },
] as const;

export interface IMouvementAccueil {
  category: string;
  audience: string;
  location: string;
  whatsapp: string;
  status: IService["status"];
  sort_order: string;
}

export const MOUVEMENT_ACCUEIL_VIDE: IMouvementAccueil = {
  category: "",
  audience: "",
  location: "",
  whatsapp: "",
  status: "published",
  sort_order: "0",
};

export function mouvementAccueilDepuis(s: IService): IMouvementAccueil {
  return {
    category: s.category ?? "",
    audience: s.audience ?? "",
    location: s.location ?? "",
    whatsapp: s.whatsapp ?? "",
    status: s.status ?? "published",
    sort_order: String(s.sort_order ?? 0),
  };
}

/** Ajoute les champs de la fiche d'accueil au FormData envoyé à /services. */
export function ajouterChampsAccueil(fd: FormData, v: IMouvementAccueil) {
  fd.append("category", v.category);
  fd.append("audience", v.audience);
  fd.append("location", v.location);
  fd.append("whatsapp", v.whatsapp);
  fd.append("status", v.status);
  fd.append("sort_order", String(Number.parseInt(v.sort_order, 10) || 0));
}

interface Props {
  valeur: IMouvementAccueil;
  onChange: (v: IMouvementAccueil) => void;
}

/** Champs de la fiche « Mouvements et groupes » de la page d'accueil. */
export function MouvementAccueilFields({ valeur, onChange }: Props) {
  const maj = <K extends keyof IMouvementAccueil>(
    cle: K,
    v: IMouvementAccueil[K],
  ) => onChange({ ...valeur, [cle]: v });

  return (
    <Card>
      <Card.Content className="p-6 space-y-4">
        <h3 className="font-semibold text-[#2d2d83]">
          Affichage sur l’accueil
        </h3>

        <Select
          selectedKey={valeur.status}
          onSelectionChange={(k) =>
            k && maj("status", String(k) as IService["status"])
          }
        >
          <Label>Statut</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {STATUTS.map((s) => (
                <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                  {s.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          placeholder="Choisir une catégorie"
          selectedKey={valeur.category || null}
          onSelectionChange={(k) => maj("category", k ? String(k) : "")}
        >
          <Label>Catégorie (filtres de l’accueil)</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {CATEGORIES_MOUVEMENT.map((c) => (
                <ListBox.Item key={c} id={c} textValue={c}>
                  {c}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <TextField value={valeur.audience} onChange={(v) => maj("audience", v)}>
          <Label>Public</Label>
          <Input placeholder="Ex : Jeunes et adultes" />
        </TextField>

        <TextField value={valeur.location} onChange={(v) => maj("location", v)}>
          <Label>Lieu des rencontres</Label>
          <Input placeholder="Ex : Salle paroissiale" />
        </TextField>

        <TextField
          type="tel"
          value={valeur.whatsapp}
          onChange={(v) => maj("whatsapp", v)}
        >
          <Label>WhatsApp du responsable</Label>
          <Input placeholder="+225 07 00 00 00 00" />
        </TextField>

        <TextField
          inputMode="numeric"
          value={valeur.sort_order}
          onChange={(v) => maj("sort_order", v.replace(/[^\d]/g, ""))}
        >
          <Label>Ordre d’affichage</Label>
          <Input placeholder="0" />
        </TextField>
      </Card.Content>
    </Card>
  );
}
