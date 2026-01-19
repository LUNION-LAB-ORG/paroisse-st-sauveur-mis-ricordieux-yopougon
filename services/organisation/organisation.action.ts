"use server";


import { OrganisationAPI } from "./api/organisation.api";
import {
  organisationSchema,
  OrganisationType,
} from "./organisation.schema";

/* ---------------- CREATE ---------------- */

export async function createOrganisation(body: OrganisationType) {
  try {
    const parsed = organisationSchema.safeParse(body);

    if (!parsed.success) {
      return {
        success: false,
        error: "Erreur de validation du formulaire",
        issues: parsed.error.flatten().fieldErrors,
      };
    }

    /* 🔍 LOG DONNÉES */
    console.log("📦 Organisation envoyée :", parsed.data);

    const response = await fetch(OrganisationAPI.create.endpoint(), {
      method: OrganisationAPI.create.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    /* 🔍 LOG RÉPONSE */
    console.log("📥 Réponse brute :", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Erreur lors de la création",
      };
    }

    const data = await response.json();

    console.log("✅ Organisation créée :", data);

    return { success: true, data };
  } catch (error) {
    console.error("🔥 Erreur createOrganisation :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
