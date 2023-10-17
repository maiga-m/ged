export interface ITypeDocument {
  id: number;
  code?: string | null;
  libelle?: string | null;
}

export type NewTypeDocument = Omit<ITypeDocument, 'id'> & { id: null };
