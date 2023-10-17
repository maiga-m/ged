import { IRayon } from 'app/entities/rayon/rayon.model';

export interface IBoite {
  id: number;
  code?: string | null;
  capacite?: number | null;
  rayon?: Pick<IRayon, 'id'> | null;
}

export type NewBoite = Omit<IBoite, 'id'> & { id: null };
