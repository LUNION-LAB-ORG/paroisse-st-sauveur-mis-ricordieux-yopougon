import { CreateEcouteType } from "./ecoute.schema";

export function buildEcouteFormData(data: CreateEcouteType): FormData {
  const formData = new FormData();

  // Champs simples
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
