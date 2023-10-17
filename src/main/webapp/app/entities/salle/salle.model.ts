export interface ISalle {
  id: number;
  code?: string | null;
  superficie?: number | null;
}

export type NewSalle = Omit<ISalle, 'id'> & { id: null };
