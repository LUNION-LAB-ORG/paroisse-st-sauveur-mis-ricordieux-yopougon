"use server";

import { EcouteAPI } from "./api/ecoute.api";
import {
  CreateEcouteSchema,
  EcouteType,
  UpdateEcouteSchema,
  UpdateEcouteType,
} from "./ecoute.schema";
import { buildEcouteFormData } from "./ecoute.utils";

/* ---------------- CREATE ---------------- */

export async function createEcoute(body: EcouteType) {
  try {
    const parsed = CreateEcouteSchema.safeParse(body);
    if (!parsed.success) {
      return { success: false, error: "Erreur de validation du formulaire" };
    }

    const formData = buildEcouteFormData(parsed.data);

    const response = await fetch(EcouteAPI.create.endpoint(), {
      method: EcouteAPI.create.method,
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
    console.error("🔥 Erreur createEcoute :", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/* ---------------- GET ALL ---------------- */

export async function getAllEcoutes(token: string) {
  try {
    const response = await fetch(EcouteAPI.getAll.endpoint(), {
      method: EcouteAPI.getAll.method,
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

export async function deleteEcoute(id: number, token: string) {
  try {
    const response = await fetch(EcouteAPI.delete.endpoint(String(id)), {
      method: EcouteAPI.delete.method,
      headers: { Authorization: `Bearer ${token}` },
    });

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

export async function updateEcoute(
  id: number,
  body: UpdateEcouteType,
  token: string
) {
  try {
    const parsed = UpdateEcouteSchema.safeParse(body);
    if (!parsed.success) {
      return { success: false, error: "Validation échouée" };
    }

    const response = await fetch(EcouteAPI.update.endpoint(String(id)), {
      method: EcouteAPI.update.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
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
    console.error("Erreur updateEcoute :", error);
    return { success: false, error: "Erreur serveur" };
  }
}
