export interface IService {
  id: number;
  title: string;
  description: string;
  image: string | null;
  created_at: string;
}

export interface IServiceCreer {
  title: string;
  description: string;
  image?: string | null;
}

export interface IServiceModifier extends Partial<IServiceCreer> {}
