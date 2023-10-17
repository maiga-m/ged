import { IProcess, NewProcess } from './process.model';

export const sampleWithRequiredData: IProcess = {
  id: 67972,
};

export const sampleWithPartialData: IProcess = {
  id: 30613,
  code: 'RAM invoic',
  nom: 'brand',
};

export const sampleWithFullData: IProcess = {
  id: 98176,
  code: '24/7 copyi',
  nom: 'red',
};

export const sampleWithNewData: NewProcess = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
