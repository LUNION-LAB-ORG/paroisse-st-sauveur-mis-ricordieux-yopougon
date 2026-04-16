"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, X, CreditCard, Users, Clock, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  message: string;
  acceptConditions: boolean;
}

interface Props {
  event: IEvenement;
  onBack: () => void;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function EventRegistration({ event, onBack }: Props) {
  const [form, setForm] = useState<FormData>({
    fullname: "",
    email: "",
    phone: "",
    message: "",
    acceptConditions: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullname.trim()) e.fullname = "Le nom complet est obligatoire";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.phone.trim()) e.phone = "Le numéro de téléphone est obligatoire";
    if (!form.acceptConditions) e.acceptConditions = "Veuillez accepter les conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const tid = toast.loading("Envoi de votre inscription...");
    try {
      const res = await evenementAPI.inscrire(String(event.id), {
        fullname: form.fullname,
        email: form.email || undefined,
        phone: form.phone,
        message: form.message || undefined,
      });

      toast.dismiss(tid);

      if (res.type === "free" || res.type === "paid_dev") {
        toast.success("Inscription confirmée !");
        setShowSuccess(true);
        return;
      }

      // Événement payant → redirection Wave
      if (res.wave_launch_url) {
        toast.success("Redirection vers Wave...");
        window.location.href = res.wave_launch_url;
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'inscription", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  // ──── Page succès (inscription gratuite) ────
  if (showSuccess) {
    return (
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: "url('/assets/images/hero-histoire.jpg')" }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Inscription confirmée !</h2>
          <p className="text-gray-600 mb-6">
            Votre inscription à <strong>{event.title}</strong> a été enregistrée avec succès.
            Nous vous contacterons prochainement avec les détails.
          </p>
          <Button onClick={onBack} className="bg-red-700 hover:bg-red-800 text-white px-8">
            Retour aux événements
          </Button>
        </div>
      </div>
    );
  }

  const isFull = event.max_participants !== null && (event.spots_remaining ?? 0) <= 0;
  const deadlinePassed =
    event.registration_deadline !== null &&
    new Date() > new Date(event.registration_deadline!);

  const closed = isFull || deadlinePassed;

  // ──── Formulaire ────
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/assets/images/hero-histoire.jpg')" }}
    >
      <div className="rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full bg-white">
        {/* Header */}
        <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center gap-1 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Button>
          <span className="text-white font-bold text-lg">Inscription à l&apos;événement</span>
          <div className="w-20" />
        </div>

        {/* Event Info */}
        <div className="bg-gray-50 border-b px-6 py-4">
          <h3 className="text-xl font-bold text-red-700 mb-3">{event.title}</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(event.date_at)}
            </span>
            {event.time_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {event.time_at}
              </span>
            )}
            {event.location_at && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {event.location_at}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {event.is_paid ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                <CreditCard className="w-3 h-3" />
                Événement payant — {Number(event.price).toLocaleString("fr-FR")} XOF
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Inscription gratuite
              </span>
            )}

            {event.max_participants !== null && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <Users className="w-3 h-3" />
                {isFull ? "Complet" : `${event.spots_remaining} place${(event.spots_remaining ?? 0) > 1 ? "s" : ""} restante${(event.spots_remaining ?? 0) > 1 ? "s" : ""}`}
              </span>
            )}

            {deadlinePassed && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                Inscriptions fermées
              </span>
            )}
          </div>
        </div>

        {/* Fermé → message */}
        {closed ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              {isFull
                ? "Cet événement est complet. Les inscriptions ne sont plus acceptées."
                : "Les inscriptions pour cet événement sont closes."}
            </p>
            <Button onClick={onBack} className="mt-6 bg-red-700 hover:bg-red-800 text-white">
              Retour
            </Button>
          </div>
        ) : (
          /* ──── Formulaire ──── */
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullname">Nom et prénom *</Label>
              <Input
                id="fullname"
                value={form.fullname}
                onChange={(e) => set("fullname", e.target.value)}
                placeholder="Votre nom complet"
                className="bg-gray-50 border-0"
              />
              {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="Votre numéro de téléphone"
                className="bg-gray-50 border-0"
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email (optionnel)</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="votre.email@example.com"
                className="bg-gray-50 border-0"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Questions ou besoins particuliers..."
                className="bg-gray-50 border-0 min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="conditions"
                checked={form.acceptConditions}
                onChange={(e) => set("acceptConditions", e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <Label htmlFor="conditions" className="text-sm text-gray-600 cursor-pointer">
                J&apos;accepte de participer à cet événement et m&apos;engage à respecter les modalités.
              </Label>
            </div>
            {errors.acceptConditions && (
              <p className="text-red-500 text-xs">{errors.acceptConditions}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-3 text-base font-semibold"
            >
              {loading ? (
                "En cours..."
              ) : event.is_paid ? (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payer {Number(event.price).toLocaleString("fr-FR")} XOF via Wave
                </span>
              ) : (
                "Confirmer mon inscription"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
