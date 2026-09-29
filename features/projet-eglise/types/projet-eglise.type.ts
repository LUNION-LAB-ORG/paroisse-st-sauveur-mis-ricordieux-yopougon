export type IPhaseStatut = "done" | "in_progress" | "upcoming";

export interface IPhase {
  name: string;
  status: IPhaseStatut;
}

export interface IProjetEglise {
  title: string;
  presentation: string | null;
  goal_amount: number;
  adjustment_amount: number;
  collected_amount: number;
  /** 0 à 100 */
  progress: number;
  phases: IPhase[];
  gallery: string[];
  image: string | null;
}
