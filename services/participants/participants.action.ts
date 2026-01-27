"use server";

import { ParticipantsAPI } from "./api/participants.api";
import { 
  ParticipantSchema, 
  ParticipantResponseSchema, 
  ParticipantsListResponseSchema 
} from "./participants.schema";
import { ParticipantType } from "./participants.schema";

export async function createParticipant(data: ParticipantType) {
  try {
    // Validation des données avec Zod
    const validatedData = ParticipantSchema.parse(data);

    console.log('Données validées:', validatedData);
    console.log('Endpoint:', ParticipantsAPI.create.endpoint());

    const res = await fetch(ParticipantsAPI.create.endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });



    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API lors de la création du participant", details: msg };
    }
    const json = await res.json();
    const parsed = ParticipantResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error('Erreur parsing:', parsed.error.format());
      return {
        error: "Format de réponse invalide",
        details: parsed.error.format(),
      };
    }

    return { data: parsed.data };
  } catch (err) {
    console.error('Erreur catch:', err);
    return { error: "Erreur serveur", details: err };
  }
}

export async function getParticipantsByEvent(eventId: number) {
  try {
    const res = await fetch(ParticipantsAPI.getByEvent.endpoint(eventId), {
      method: "GET",
    });

    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API lors de la récupération des participants", details: msg };
    }

    const json = await res.json();

    const parsed = ParticipantsListResponseSchema.safeParse(json);

    if (!parsed.success) {
      return {
        error: "Format de réponse invalide",
        details: parsed.error.format(),
      };
    }

    return { data: parsed.data };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}

export async function getAllParticipants() {
  try {
    const res = await fetch(ParticipantsAPI.getAll.endpoint(), {
      method: "GET",
    });

    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API lors de la récupération des participants", details: msg };
    }

    const json = await res.json();

    const parsed = ParticipantsListResponseSchema.safeParse(json);

    if (!parsed.success) {
      return {
        error: "Format de réponse invalide",
        details: parsed.error.format(),
      };
    }

    return { data: parsed.data };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}
