"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EventRegistration from "../event-registration";
import type { IEvenement } from "@/features/evenement/types/evenement.type";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";

export default function InscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<IEvenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    evenementAPI
      .obtenirParId(id)
      .then(setEvent)
      .catch(() => setError("Événement introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Événement introuvable</h1>
          <button
            onClick={() => router.push("/evenement")}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-md"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <EventRegistration event={event} onBack={() => router.push(`/evenement/${id}`)} />;
}
