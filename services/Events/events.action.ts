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
