import { IRayon, NewRayon } from './rayon.model';

export const sampleWithRequiredData: IRayon = {
  id: 84196,
};

export const sampleWithPartialData: IRayon = {
  id: 90228,
  code: 'Tchad Hand',
  nom: 'Rand',
};

export const sampleWithFullData: IRayon = {
  id: 92215,
  code: 'Cheese',
  nom: 'Frozen',
};

export const sampleWithNewData: NewRayon = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
