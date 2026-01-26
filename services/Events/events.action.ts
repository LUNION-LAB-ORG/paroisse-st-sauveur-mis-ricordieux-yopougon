"use server";

import { EventAPI } from "./api/events.api";

export async function getAllEvents() {
  try {
    const res = await fetch(EventAPI.getAll.endpoint(), {
      method: EventAPI.getAll.method,
    });

    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API", details: msg };
    }

    return { data: await res.json() };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}

export async function getEventById(id: number) {
  try {
    // Récupérer tous les événements et filtrer par ID
    const result = await getAllEvents();
    
    if (result.error) {
      return { error: result.error, details: result.details };
    }

    const events = result.data?.data || [];
    const event = events.find((e: any) => e.id === id);

    if (!event) {
      return { error: "Événement non trouvé" };
    }

    return { data: event };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}
