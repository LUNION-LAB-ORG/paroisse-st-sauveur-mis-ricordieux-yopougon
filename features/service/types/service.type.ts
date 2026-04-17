export interface IService {
  id: number;
  title: string;
  description: string;
  image: string | null;
  content: string | null;
  leader: string | null;
  schedule: string | null;
  created_at: string;
}

export interface IServiceCreer {
  title: string;
  description: string;
  image?: File | null;
  content?: string;
  leader?: string;
  schedule?: string;
}

export interface IServiceModifier extends Partial<IServiceCreer> {}
