import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../salle.test-samples';

import { SalleFormService } from './salle-form.service';

describe('Salle Form Service', () => {
  let service: SalleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalleFormService);
  });

  describe('Service methods', () => {
    describe('createSalleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSalleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            superficie: expect.any(Object),
          })
        );
      });

      it('passing ISalle should create a new form with FormGroup', () => {
        const formGroup = service.createSalleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            superficie: expect.any(Object),
          })
        );
      });
    });

    describe('getSalle', () => {
      it('should return NewSalle for default Salle initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSalleFormGroup(sampleWithNewData);

        const salle = service.getSalle(formGroup) as any;

        expect(salle).toMatchObject(sampleWithNewData);
      });

      it('should return NewSalle for empty Salle initial value', () => {
        const formGroup = service.createSalleFormGroup();

        const salle = service.getSalle(formGroup) as any;

        expect(salle).toMatchObject({});
      });

      it('should return ISalle', () => {
        const formGroup = service.createSalleFormGroup(sampleWithRequiredData);

        const salle = service.getSalle(formGroup) as any;

        expect(salle).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISalle should not enable id FormControl', () => {
        const formGroup = service.createSalleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSalle should disable id FormControl', () => {
        const formGroup = service.createSalleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
