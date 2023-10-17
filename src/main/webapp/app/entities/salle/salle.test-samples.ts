import { ISalle, NewSalle } from './salle.model';

export const sampleWithRequiredData: ISalle = {
  id: 80632,
};

export const sampleWithPartialData: ISalle = {
  id: 8641,
  code: 'Centre Hau',
};

export const sampleWithFullData: ISalle = {
  id: 33399,
  code: 'Technicien',
  superficie: 26215,
};

export const sampleWithNewData: NewSalle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
