import { IntentionType } from "./messes.schema";

export function buildIntentionFormData(data: IntentionType) {
  const formData = new FormData();

  formData.append("type", data.type);
  formData.append("fullname", data.fullname);
  formData.append("phone", data.phone);
  formData.append("message", data.message);
  formData.append("amount", String(data.amount));
  formData.append("date_at", data.date_at);
  formData.append("time_at", data.time_at);

  if (data.email) {
    formData.append("email", data.email);
  }

  // 🧩 LE CHAMP MANQUANT
  formData.append("request_status", data.request_status);

  return formData;
}
