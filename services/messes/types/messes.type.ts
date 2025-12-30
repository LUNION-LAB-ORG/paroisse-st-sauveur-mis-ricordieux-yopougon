export type RequestStatus = "pending" | "accepted" | "canceled";

export interface IntentionType {
  id?: number;
  type: string;
  fullname: string;
  email?: string | null;
  phone: string;
  message: string;
  amount: number;
  date_at: string;
  time_at: string;
  request_status: RequestStatus;
  created_at?: string;
}
