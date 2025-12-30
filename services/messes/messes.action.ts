"use server";

import { IntentionsAPI } from "./api/messes.api";
import {
  CreateIntentionSchema,
  IntentionType,
  UpdateIntentionSchema,
  UpdateIntentionType,
} from "./messes.schema";
import { buildIntentionFormData } from "./messes.utils";

/* ---------------- CREATE ---------------- */

export async function createIntention(body: IntentionType) {
  try {
    const parsed = CreateIntentionSchema.safeParse(body);
    if (!parsed.success) {
      return { success: false, error: "Erreur de validation du formulaire" };
    }

    const formData = buildIntentionFormData(parsed.data);

    const response = await fetch(IntentionsAPI.create.endpoint(), {
      method: IntentionsAPI.create.method,
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || `Erreur ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("🔥 Erreur createIntention :", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/* ---------------- GET ALL ---------------- */

export async function getAllIntentions(token: string) {
  try {
    const response = await fetch(IntentionsAPI.getAll.endpoint(), {
      method: IntentionsAPI.getAll.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Erreur de chargement" };
    }

    const data = await response.json();
    return { success: true, data: data.data ?? data };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

/* ---------------- DELETE ---------------- */

export async function deleteIntention(id: number, token: string) {
  try {
    const response = await fetch(
      IntentionsAPI.delete.endpoint(String(id)),
      {
        method: IntentionsAPI.delete.method,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Erreur suppression" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

/* ---------------- UPDATE ---------------- */

export async function updateIntention(
  id: number,
  body: UpdateIntentionType,
  token: string
) {
  try {
    const parsed = UpdateIntentionSchema.safeParse(body);
    if (!parsed.success) {
      return { success: false, error: "Validation échouée" };
    }

    const response = await fetch(
      IntentionsAPI.update.endpoint(String(id)),
      {
        method: IntentionsAPI.update.method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || `Erreur ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erreur updateIntention :", error);
    return { success: false, error: "Erreur serveur" };
  }
}
