import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sous-service.test-samples';

import { SousServiceFormService } from './sous-service-form.service';

describe('SousService Form Service', () => {
  let service: SousServiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousServiceFormService);
  });

  describe('Service methods', () => {
    describe('createSousServiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSousServiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            nom: expect.any(Object),
            service: expect.any(Object),
          })
        );
      });

      it('passing ISousService should create a new form with FormGroup', () => {
        const formGroup = service.createSousServiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            nom: expect.any(Object),
            service: expect.any(Object),
          })
        );
      });
    });

    describe('getSousService', () => {
      it('should return NewSousService for default SousService initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSousServiceFormGroup(sampleWithNewData);

        const sousService = service.getSousService(formGroup) as any;

        expect(sousService).toMatchObject(sampleWithNewData);
      });

      it('should return NewSousService for empty SousService initial value', () => {
        const formGroup = service.createSousServiceFormGroup();

        const sousService = service.getSousService(formGroup) as any;

        expect(sousService).toMatchObject({});
      });

      it('should return ISousService', () => {
        const formGroup = service.createSousServiceFormGroup(sampleWithRequiredData);

        const sousService = service.getSousService(formGroup) as any;

        expect(sousService).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISousService should not enable id FormControl', () => {
        const formGroup = service.createSousServiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSousService should disable id FormControl', () => {
        const formGroup = service.createSousServiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
