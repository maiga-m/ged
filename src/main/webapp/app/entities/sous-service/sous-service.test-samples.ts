import { ISousService, NewSousService } from './sous-service.model';

export const sampleWithRequiredData: ISousService = {
  id: 33268,
};

export const sampleWithPartialData: ISousService = {
  id: 29311,
  code: 'de',
  nom: 'Bosnie-Herzégovine b',
};

export const sampleWithFullData: ISousService = {
  id: 99894,
  code: 'real-time',
  nom: 'hub b',
};

export const sampleWithNewData: NewSousService = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
