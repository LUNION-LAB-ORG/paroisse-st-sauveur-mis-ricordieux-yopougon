export interface Participant {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  message: string;
  event: {
    id: number;
    title: string;
    description: string;
    date_at: string;
    time_at: string;
    image: string;
    location_at: string;
    created_at: string;
  };
  created_at: string;
}
