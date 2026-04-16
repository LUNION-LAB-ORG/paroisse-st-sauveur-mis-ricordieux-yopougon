import { CreerEcouteSchemaType } from "../schemas/ecoute.schema";

export function buildEcouteFormData(data: CreerEcouteSchemaType): FormData {
  const formData = new FormData();

  // Champs obligatoires
  formData.append("fullname", data.fullname);
  formData.append("availability", data.availability);
  formData.append("message", data.message);
  formData.append("acceptConditions", data.acceptConditions.toString());
  formData.append("request_status", data.request_status);

  // Champs optionnels
  if (data.type) {
    formData.append("type", data.type);
  }

  if (data.phone) {
    formData.append("phone", data.phone);
  }

  return formData;
}
