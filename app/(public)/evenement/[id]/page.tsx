"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventRegistration from "./event-registration";
import type { IEvenement } from "@/features/evenement/types/evenement.type";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";

export default function Page() {
  const { id } = useParams<{ id: string }>();
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

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Événement non trouvé</h1>
          <p className="text-gray-600 mb-6">
            {error || "L'événement que vous recherchez n'existe pas."}
          </p>
          <button
            onClick={handleBack}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-md"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return <EventRegistration event={event} onBack={handleBack} />;
}
