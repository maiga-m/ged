import { ISalle } from 'app/entities/salle/salle.model';

export interface IRayon {
  id: number;
  code?: string | null;
  nom?: string | null;
  salle?: Pick<ISalle, 'id'> | null;
}

export type NewRayon = Omit<IRayon, 'id'> & { id: null };
