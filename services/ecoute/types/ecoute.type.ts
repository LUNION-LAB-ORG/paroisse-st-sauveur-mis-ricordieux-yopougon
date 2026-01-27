export interface EcouteRequest {
  id?: number;
  type?: string;
  fullname: string;
  phone?: string;
  availability: string;
  message: string;
  acceptConditions: boolean;
  request_status?: "pending" | "accepted" | "canceled";
  created_at?: string;
}

export interface EcouteResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface EcouteListResponse {
  success: boolean;
  data?: EcouteRequest[];
  error?: string;
}
