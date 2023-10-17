import { IService } from 'app/entities/service/service.model';

export interface ISousService {
  id: number;
  code?: string | null;
  nom?: string | null;
  service?: Pick<IService, 'id'> | null;
}

export type NewSousService = Omit<ISousService, 'id'> & { id: null };
