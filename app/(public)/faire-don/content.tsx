"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  TextField,
  TextArea,
  Input,
  Label,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  ListBox,
} from "@heroui/react";

import { HeroCommon } from "@/components/common/hero-common";
import CardContainer from "@/components/faireDon/CardContainer";
import { waveAPI } from "@/features/don/apis/wave.api";
import { donAPI } from "@/features/don/apis/don.api";

const HERO_IMG = "/assets/images/hero-faire-don.jpg";

const AMOUNTS_PRESET = [500, 1000, 1500, 2000, 5000, 10000] as const;

const PROJECTS = [
  { key: "Fonctionnement", label: "Fonctionnement général" },
  { key: "Construction", label: "Construction / Rénovation" },
  { key: "Actions caritatives", label: "Aide aux plus démunis" },
  { key: "Chorale - instruments", label: "Chorale & instruments" },
  { key: "Réfection toiture", label: "Réfection de la toiture" },
  { key: "Caisse paroisse", label: "Caisse de la paroisse" },
  { key: "Autre", label: "Autre projet" },
] as const;

const PROJETS_AFFICHES = [
  {
    title: "Fonctionnement général de la paroisse",
    description: "Entretien des locaux, chauffage, électricité et frais quotidiens.",
    collectes: "54% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Rénovation de la chapelle",
    description: "Restauration des vitraux, réfection de la toiture et mise aux normes électriques.",
    collectes: "32% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Aide aux plus démunis",
    description: "Soutien alimentaire, accompagnement social et actions caritatives pour les familles.",
    collectes: "78% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
];

type Step = 1 | 2 | 3;
type PaymentMode = "wave" | "paroisse";

interface FormState {
  amount: number;          // montant final en XOF
  project: string;         // clé projet
  donator: string;
  email: string;
  phone: string;
  description: string;
  mode: PaymentMode | "";
}

const INITIAL: FormState = {
  amount: 0,
  project: "Fonctionnement",
  donator: "",
  email: "",
  phone: "",
  description: "",
  mode: "",
};

export default function Content() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [customSelected, setCustomSelected] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ─────────────────────────── STEP 1 validation ─────────────────────────── */
  const validateStep1 = () => {
    if (!form.amount || form.amount < 100) {
      toast.error("Le montant minimum est de 100 XOF.");
      return false;
    }
    if (!form.project) {
      toast.error("Veuillez choisir une affectation pour votre don.");
      return false;
    }
    return true;
  };

  /* ─────────────────────────── STEP 2 validation ─────────────────────────── */
  const validateStep2 = () => {
    if (!form.donator.trim()) {
      toast.error("Votre nom est requis.");
      return false;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Adresse email invalide.");
      return false;
    }
    return true;
  };

  /* ─────────────────────────── Submit final ──────────────────────────────── */
  const submit = async () => {
    if (!form.mode) {
      toast.error("Veuillez choisir un mode de paiement.");
      return;
    }

    setSubmitting(true);
    try {
      if (form.mode === "wave") {
        const toastId = toast.loading("Redirection vers Wave…");
        const result = await waveAPI.createCheckout({
          amount: form.amount,
          type: "donation",
          donator: form.donator.trim() || "Anonyme",
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          project: form.project,
          description: form.description.trim() || `Don de ${form.donator || "Anonyme"} via le site`,
        });
        toast.success("Redirection en cours…", { id: toastId });
        window.location.href = result.wave_launch_url;
        return;
      }

      // Mode paroisse : don enregistré en pending, paiement effectué sur place
      await donAPI.ajouterPublic({
        donator: form.donator.trim() || "Anonyme",
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        amount: form.amount,
        project: form.project,
        description: form.description.trim() || null,
      });

      toast.success("Don enregistré — rendez-vous à la paroisse pour le versement.");
      // Redirection vers une page succès dédiée au cas paroisse
      window.location.href = `/faire-don/paiement/succes?mode=paroisse`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement du don.";
      toast.error(msg);
      setSubmitting(false);
    }
  };

  const amountIsCustom = customSelected || (!!form.amount && !AMOUNTS_PRESET.includes(form.amount as (typeof AMOUNTS_PRESET)[number]));

  /* ─────────────────────────── Render ────────────────────────────────────── */
  return (
    <div className="flex flex-col pb-16">
      <HeroCommon
        btnRetour
        img={HERO_IMG}
        txt1="Soutenir la Paroisse Saint Sauveur Miséricordieux"
        txt2="Votre générosité fait vivre notre communauté et ses œuvres."
      />

      <div className="max-w-3xl mx-auto w-full px-4 pt-10 lg:pt-14">
        {/* Progress */}
        <ol className="flex items-center justify-between mb-8">
          {[
            { n: 1, label: "Montant & projet" },
            { n: 2, label: "Coordonnées" },
            { n: 3, label: "Paiement" },
          ].map((s, i, arr) => {
            const active = step === s.n;
            const done = step > s.n;
            return (
              <li key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                          ? "bg-[#98141f] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? "✓" : s.n}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center hidden sm:block ${
                      active ? "text-[#98141f] font-semibold" : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${step > s.n ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </li>
            );
          })}
        </ol>

        <Card>
          <Card.Content className="p-6 sm:p-8 space-y-6">
            {step === 1 && (
              <>
                <header>
                  <p className="text-[#98141f] text-xs font-semibold uppercase tracking-widest mb-1">
                    Étape 1 / 3
                  </p>
                  <h2 className="text-[#2d2d83] text-2xl font-bold">Montant & affectation</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Choisissez un montant, puis indiquez à quel projet vous souhaitez l'affecter.
                  </p>
                </header>

                <div>
                  <Label>Montant du don (XOF)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {AMOUNTS_PRESET.map((m) => {
                      const selected = !customSelected && form.amount === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setCustomSelected(false);
                            update("amount", m);
                          }}
                          className={`rounded-xl p-4 text-center font-bold transition-all border-2 ${
                            selected
                              ? "border-[#98141f] bg-[#98141f]/5 text-[#98141f]"
                              : "border-gray-200 bg-white text-[#2d2d83] hover:border-[#2d2d83]/30"
                          }`}
                        >
                          {m.toLocaleString("fr-FR")} F
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSelected(true);
                        update("amount", 0);
                      }}
                      className={`rounded-xl p-4 text-center font-bold transition-all border-2 ${
                        customSelected
                          ? "border-[#98141f] bg-[#98141f]/5 text-[#98141f]"
                          : "border-gray-200 bg-white text-[#2d2d83] hover:border-[#2d2d83]/30"
                      }`}
                    >
                      Autre
                    </button>
                  </div>
                  {amountIsCustom && (
                    <div className="mt-4">
                      <NumberField
                        fullWidth
                        value={form.amount || NaN}
                        onChange={(v) => update("amount", isNaN(v) ? 0 : v)}
                        minValue={100}
                        step={500}
                      >
                        <Label>Montant personnalisé</Label>
                        <NumberField.Group>
                          <NumberField.Input placeholder="Ex : 10 000" />
                          <NumberField.DecrementButton />
                          <NumberField.IncrementButton />
                        </NumberField.Group>
                      </NumberField>
                    </div>
                  )}
                </div>

                <Select
                  selectedKey={form.project}
                  onSelectionChange={(k) => update("project", String(k))}
                >
                  <Label>Affectation du don</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {PROJECTS.map((p) => (
                        <ListBox.Item key={p.key} id={p.key} textValue={p.label}>
                          {p.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="primary"
                    className="bg-[#98141f] rounded-xl px-6"
                    onPress={() => validateStep1() && setStep(2)}
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <header>
                  <p className="text-[#98141f] text-xs font-semibold uppercase tracking-widest mb-1">
                    Étape 2 / 3
                  </p>
                  <h2 className="text-[#2d2d83] text-2xl font-bold">Vos coordonnées</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Pour que nous puissions vous remercier et vous envoyer un reçu si vous le souhaitez.
                  </p>
                </header>

                <TextField value={form.donator} onChange={(v) => update("donator", v)} isRequired>
                  <Label>Nom et prénom</Label>
                  <Input placeholder="Ex : Marie Konan" />
                </TextField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField value={form.email} onChange={(v) => update("email", v)} type="email">
                    <Label>Email (recommandé)</Label>
                    <Input placeholder="vous@exemple.com" />
                  </TextField>

                  <TextField value={form.phone} onChange={(v) => update("phone", v)} type="tel">
                    <Label>Téléphone (optionnel)</Label>
                    <Input placeholder="+225 07 00 00 00 00" />
                  </TextField>
                </div>

                <TextField value={form.description} onChange={(v) => update("description", v)}>
                  <Label>Message à la paroisse (optionnel)</Label>
                  <TextArea rows={3} placeholder="Intention, mot personnel…" />
                </TextField>

                <div className="flex justify-between pt-2">
                  <Button variant="secondary" className="rounded-xl" onPress={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-[#98141f] rounded-xl px-6"
                    onPress={() => validateStep2() && setStep(3)}
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <header>
                  <p className="text-[#98141f] text-xs font-semibold uppercase tracking-widest mb-1">
                    Étape 3 / 3
                  </p>
                  <h2 className="text-[#2d2d83] text-2xl font-bold">Mode de paiement</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Choisissez comment vous souhaitez verser votre don.
                  </p>
                </header>

                <RadioGroup
                  value={form.mode}
                  onChange={(v: string) => update("mode", (v as PaymentMode) || "")}
                >
                  <div
                    className={`rounded-xl border-2 p-4 transition-colors ${
                      form.mode === "wave"
                        ? "border-[#98141f] bg-[#98141f]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Radio value="wave">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <p className="font-semibold text-gray-800">Paiement en ligne — Wave</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Paiement mobile sécurisé. Redirection vers Wave, retour automatique après validation.
                        </p>
                      </Radio.Content>
                    </Radio>
                  </div>

                  <div
                    className={`rounded-xl border-2 p-4 transition-colors ${
                      form.mode === "paroisse"
                        ? "border-[#98141f] bg-[#98141f]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Radio value="paroisse">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <p className="font-semibold text-gray-800">Paiement à la paroisse</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          En espèces ou par chèque, directement à la paroisse. Votre don est pré-enregistré et
                          validé par le secrétariat à réception.
                        </p>
                      </Radio.Content>
                    </Radio>
                  </div>
                </RadioGroup>

                {/* Récapitulatif */}
                <div className="rounded-xl bg-gray-50 p-5 space-y-2 text-sm">
                  <h3 className="font-semibold text-[#2d2d83] mb-2">Récapitulatif</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant</span>
                    <span className="font-bold text-[#98141f]">
                      {form.amount.toLocaleString("fr-FR")} XOF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Affectation</span>
                    <span className="font-medium text-gray-800">
                      {PROJECTS.find((p) => p.key === form.project)?.label ?? form.project}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Donateur</span>
                    <span className="font-medium text-gray-800">{form.donator || "—"}</span>
                  </div>
                  {form.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-800">{form.email}</span>
                    </div>
                  )}
                  {form.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Téléphone</span>
                      <span className="font-medium text-gray-800">{form.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="secondary"
                    className="rounded-xl"
                    onPress={() => setStep(2)}
                    isDisabled={submitting}
                  >
                    <ArrowLeft className="w-4 h-4" /> Précédent
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-[#98141f] rounded-xl px-6"
                    onPress={submit}
                    isDisabled={submitting || !form.mode}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" /> Faire mon don
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card.Content>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 pt-14">
        <CardContainer dataContainer={PROJETS_AFFICHES} txt1="Nos projets en cours" />
      </div>
    </div>
  );
}
