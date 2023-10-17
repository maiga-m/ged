import dayjs from 'dayjs/esm';
import { ITypeDocument } from 'app/entities/type-document/type-document.model';
import { IBoite } from 'app/entities/boite/boite.model';
import { IProcess } from 'app/entities/process/process.model';
import { IService } from 'app/entities/service/service.model';
import { ISousService } from 'app/entities/sous-service/sous-service.model';

export interface IDossier {
  id: number;
  code?: string | null;
  motCle?: string | null;
  dateProduction?: dayjs.Dayjs | null;
  typeDocument?: Pick<ITypeDocument, 'id'> | null;
  boite?: Pick<IBoite, 'id'> | null;
  process?: Pick<IProcess, 'id'> | null;
  service?: Pick<IService, 'id'> | null;
  sousService?: Pick<ISousService, 'id'> | null;
}

export type NewDossier = Omit<IDossier, 'id'> & { id: null };
