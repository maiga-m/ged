export interface IProcess {
  id: number;
  code?: string | null;
  nom?: string | null;
}

export type NewProcess = Omit<IProcess, 'id'> & { id: null };
