"use server";

import { CureAPI } from "./api/cure.api";
import { PastorResponseSchema } from "./cure.schema";

export async function getAllPastors() {
  try {
    const res = await fetch(CureAPI.getAll.endpoint(), {
      method: "GET",
    });

    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API", details: msg };
    }

    const json = await res.json();

    const parsed = PastorResponseSchema.safeParse(json);

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
