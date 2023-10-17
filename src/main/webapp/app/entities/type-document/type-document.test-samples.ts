import { ITypeDocument, NewTypeDocument } from './type-document.model';

export const sampleWithRequiredData: ITypeDocument = {
  id: 72385,
};

export const sampleWithPartialData: ITypeDocument = {
  id: 36669,
  code: 'Exclusive',
};

export const sampleWithFullData: ITypeDocument = {
  id: 77662,
  code: 'Soft PCI',
  libelle: 'architectures Account',
};

export const sampleWithNewData: NewTypeDocument = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
