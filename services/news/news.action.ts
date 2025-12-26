"use server";

import { NewsAPI } from "./api/news.api";
import {
  NewsSchema,
  NewsType,
  UpdateNewsSchema,
  UpdateNewsType,
} from "./news.schema";

/* ---------------- UTILS ---------------- */

// function buildNewsFormData(data: Partial<NewsType>) {
//   const formData = new FormData();

//   if (data.title) formData.append("title", data.title);
//   if (data.new_resume) formData.append("new_resume", data.new_resume);
//   if (data.location) formData.append("location", data.location);
//   if (data.content) formData.append("content", data.content);
//   if (data.new_status) formData.append("new_status", data.new_status);
//  if (data.published_at) {
//     formData.append("published_at", data.published_at);
//   } else {
//     // fallback intelligent
//     formData.append(
//       "published_at",
//       new Date().toISOString().split("T")[0]
//     );
//   }

//   // image uniquement si File (upload)
//   if (data.image instanceof File) {
//     formData.append("image", data.image);
//   }

//   return formData;
// }

/* ---------------- CREATE ---------------- */

// export async function createNews(body: NewsType, token: string) {
//   try {
//     const parsed = NewsSchema.safeParse(body);
//     if (!parsed.success) {
//       return {
//         success: false,
//         error: "Erreur de validation du formulaire",
//       };
//     }

//     const formData = buildNewsFormData(parsed.data);

//     /* 🔍 LOG FORM DATA (lisible) */
//     console.log("📦 FormData envoyé au backend :");
//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         console.log(`- ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
//       } else {
//         console.log(`- ${key}:`, value);
//       }
//     }

//     /* 🔍 LOG REQUÊTE */
//     console.log("🚀 Requête createNews", {
//       url: NewsAPI.create.endpoint(),
//       method: NewsAPI.create.method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//          Accept: "application/json",
//       },
//     });

//   const response = await fetch(NewsAPI.create.endpoint(), {
//   method: NewsAPI.create.method,
//   headers: {
//     Authorization: `Bearer ${token}`,
//     Accept: "application/json",
//   },
//   body: formData,
// });


//     /* 🔍 LOG RÉPONSE BRUTE */
//     console.log("📥 Réponse brute", {
//       ok: response.ok,
//       status: response.status,
//       statusText: response.statusText,
//       redirected: response.redirected,
//       url: response.url,
//       headers: Object.fromEntries(response.headers.entries()),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("❌ Erreur backend (raw):", errorText);

//       try {
//         const errorData = JSON.parse(errorText);
//         return {
//           success: false,
//           error:
//             typeof errorData.message === "string"
//               ? errorData.message
//               : errorData.message?.[0] || `Erreur ${response.status}`,
//         };
//       } catch {
//         return {
//           success: false,
//           error: errorText || `Erreur ${response.status}`,
//         };
//       }
//     }

//     const data = await response.json();
//     console.log("✅ Réponse JSON backend :", data);

//     return { success: true, data };
//   } catch (error) {
//     console.error("🔥 Erreur createNews :", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Erreur inconnue",
//     };
//   }
// }


/* ---------------- GET ALL ---------------- */

export async function getAllNews() {
  try {
    const response = await fetch(NewsAPI.getAll.endpoint(), {
      method: NewsAPI.getAll.method,
      headers: {
      
         Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Erreur lors du chargement",
      };
    }

    const data = await response.json();
    return { success: true, data: data.data ?? data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/* ---------------- DELETE ---------------- */

export async function deleteNews(id: number, token: string) {
  try {
    const response = await fetch(NewsAPI.delete.endpoint(String(id)), {
      method: NewsAPI.delete.method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Erreur lors de la suppression",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur deleteNews :", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/* ---------------- UPDATE ---------------- */

// export async function updateNews(
//   id: number,
//   body: UpdateNewsType,
//   token: string
// ) {
//   try {
//     const parsed = UpdateNewsSchema.safeParse(body);
//     if (!parsed.success) {
//       return { success: false, error: "Validation échouée" };
//     }

//     const hasFile = parsed.data.image instanceof File;

//     const response = await fetch(NewsAPI.update.endpoint(String(id)), {
//       method: NewsAPI.update.method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         ...(hasFile ? {} : { "Content-Type": "application/json" }),
//       },
//       body: hasFile
//         ? buildNewsFormData(parsed.data)
//         : JSON.stringify(parsed.data),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       return {
//         success: false,
//         error: errorText || `Erreur ${response.status}`,
//       };
//     }

//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error("Erreur updateNews :", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Erreur inconnue",
//     };
//   }
// }
