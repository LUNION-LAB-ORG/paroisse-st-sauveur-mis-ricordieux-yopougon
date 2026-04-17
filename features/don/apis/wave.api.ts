import { apiServer } from "@/lib/api";

export interface WaveCheckoutParams {
  amount: number;
  type: "donation" | "messe" | "event";
  client_reference?: string;
  donator?: string;
  project?: string;
  description?: string;
  event_id?: number;
  // Champs messe
  mess_type?: string;
  email?: string;
  phone?: string;
  date_at?: string;
  time_at?: string;
}

export interface WaveCheckoutResponse {
  checkout_id: string;
  wave_launch_url: string;
  amount: string;
  currency: string;
  expires_at: string | null;
}

export interface WaveStatusResponse {
  checkout_status: "open" | "complete" | "expired";
  payment_status: "processing" | "cancelled" | "succeeded";
  transaction_id: string | null;
  amount: string;
  when_completed: string | null;
}

export const waveAPI = {
  /**
   * Créer une session de paiement Wave
   * Retourne l'URL de redirection vers Wave
   */
  createCheckout: async (params: WaveCheckoutParams): Promise<WaveCheckoutResponse> => {
    const res = await apiServer.post("/wave/checkout", params, "public");
    return res;
  },

  /**
   * Vérifier le statut d'un paiement
   */
  checkStatus: async (checkoutId: string): Promise<WaveStatusResponse> => {
    const res = await apiServer.get(`/wave/checkout/${checkoutId}/status`, undefined, "public");
    return res;
  },
};
