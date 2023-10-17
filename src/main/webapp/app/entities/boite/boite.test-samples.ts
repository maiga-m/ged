import { IBoite, NewBoite } from './boite.model';

export const sampleWithRequiredData: IBoite = {
  id: 73644,
};

export const sampleWithPartialData: IBoite = {
  id: 96838,
};

export const sampleWithFullData: IBoite = {
  id: 30611,
  code: 'hardware',
  capacite: 71270,
};

export const sampleWithNewData: NewBoite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
