
"use server";


import { NewsAPI } from "./api/news.api";
import { NewsItemType, NewsSchema } from "./news.schema";


// -----------------------------
// CREATE EVENT
// -----------------------------
export async function createEvent(data: NewsItemType) {
  // 1. Validation des données du front avec Zod
  const parsed = NewsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Validation échouée", details: parsed.error.flatten() };
  }

  try {
    // 2. Requête API POST vers ton backend
    const res = await fetch(NewsAPI.create.endpoint, {
      method: NewsAPI.create.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    // 3. Gestion des erreurs HTTP
    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API", details: msg };
    }

    // 4. Retour du résultat
    return { data: await res.json() };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}

// -----------------------------
// GET ALL EVENTS
// -----------------------------
export async function getAllNews() {
  try {
    const res = await fetch(NewsAPI.getAll.endpoint(), {
      method: NewsAPI.getAll.method,
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

// -----------------------------
// GET ONE EVENT
// -----------------------------
export async function getOneNews(id: string) {
  try {
    const res = await fetch(NewsAPI.getOne.endpoint(id), {
      method: NewsAPI.getOne.method,
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

// -----------------------------
// UPDATE EVENT
// -----------------------------
export async function updateNews(id: string, data: Partial<NewsItemType>) {
  // 1. Validation partielle des données
  const parsed = NewsSchema.partial().safeParse(data);

  if (!parsed.success) {
    return { error: "Validation échouée", details: parsed.error.flatten() };
  }

  try {
    const res = await fetch(NewsAPI.update.endpoint(id), {
      method: NewsAPI.update.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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

// -----------------------------
// DELETE EVENT
// -----------------------------
export async function deleteNews(id: string) {
  try {
    const res = await fetch(NewsAPI.delete.endpoint(id), {
      method: NewsAPI.delete.method,
    });

    if (!res.ok) {
      const msg = await res.text();
      return { error: "Erreur API", details: msg };
    }

    return { data: "Événement supprimé avec succès" };
  } catch (err) {
    return { error: "Erreur serveur", details: err };
  }
}
