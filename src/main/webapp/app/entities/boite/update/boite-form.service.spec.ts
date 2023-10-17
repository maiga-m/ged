import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../boite.test-samples';

import { BoiteFormService } from './boite-form.service';

describe('Boite Form Service', () => {
  let service: BoiteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoiteFormService);
  });

  describe('Service methods', () => {
    describe('createBoiteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBoiteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            capacite: expect.any(Object),
            rayon: expect.any(Object),
          })
        );
      });

      it('passing IBoite should create a new form with FormGroup', () => {
        const formGroup = service.createBoiteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            capacite: expect.any(Object),
            rayon: expect.any(Object),
          })
        );
      });
    });

    describe('getBoite', () => {
      it('should return NewBoite for default Boite initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBoiteFormGroup(sampleWithNewData);

        const boite = service.getBoite(formGroup) as any;

        expect(boite).toMatchObject(sampleWithNewData);
      });

      it('should return NewBoite for empty Boite initial value', () => {
        const formGroup = service.createBoiteFormGroup();

        const boite = service.getBoite(formGroup) as any;

        expect(boite).toMatchObject({});
      });

      it('should return IBoite', () => {
        const formGroup = service.createBoiteFormGroup(sampleWithRequiredData);

        const boite = service.getBoite(formGroup) as any;

        expect(boite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBoite should not enable id FormControl', () => {
        const formGroup = service.createBoiteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBoite should disable id FormControl', () => {
        const formGroup = service.createBoiteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
