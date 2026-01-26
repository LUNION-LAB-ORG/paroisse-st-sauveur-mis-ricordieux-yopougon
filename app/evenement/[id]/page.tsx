"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import EventRegistration from "./event-registration";
import { Event } from "@/services/Events/types/events.type";
import { getAllEvents } from "@/services/Events/events.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { id } = await params;
        const eventId = parseInt(id);
        
        console.log('Recherche de l\'événement ID:', eventId);
        
        // Utiliser votre getAllEvents existant
        const result = await getAllEvents();
        
        if (result.error) {
          setError(result.error);
          return;
        }

        const events = result.data?.data || [];
        const foundEvent = events.find((e: any) => e.id === eventId);

        if (!foundEvent) {
          setError(`Événement avec ID ${eventId} non trouvé`);
          return;
        }

        console.log('Événement trouvé:', foundEvent);
        setEvent(foundEvent);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Erreur lors du chargement de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params]);

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
