import dayjs from 'dayjs/esm';

import { IDossier, NewDossier } from './dossier.model';

export const sampleWithRequiredData: IDossier = {
  id: 33437,
};

export const sampleWithPartialData: IDossier = {
  id: 38658,
};

export const sampleWithFullData: IDossier = {
  id: 4735,
  code: 'paradigm h',
  motCle: 'c Bosnie-Herzégovine',
  dateProduction: dayjs('2023-10-14'),
};

export const sampleWithNewData: NewDossier = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
