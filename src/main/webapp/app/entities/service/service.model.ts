export interface IService {
  id: number;
  code?: string | null;
  nom?: string | null;
}

export type NewService = Omit<IService, 'id'> & { id: null };
