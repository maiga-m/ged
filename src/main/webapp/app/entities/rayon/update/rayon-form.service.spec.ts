import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../rayon.test-samples';

import { RayonFormService } from './rayon-form.service';

describe('Rayon Form Service', () => {
  let service: RayonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RayonFormService);
  });

  describe('Service methods', () => {
    describe('createRayonFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRayonFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            nom: expect.any(Object),
            salle: expect.any(Object),
          })
        );
      });

      it('passing IRayon should create a new form with FormGroup', () => {
        const formGroup = service.createRayonFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            nom: expect.any(Object),
            salle: expect.any(Object),
          })
        );
      });
    });

    describe('getRayon', () => {
      it('should return NewRayon for default Rayon initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRayonFormGroup(sampleWithNewData);

        const rayon = service.getRayon(formGroup) as any;

        expect(rayon).toMatchObject(sampleWithNewData);
      });

      it('should return NewRayon for empty Rayon initial value', () => {
        const formGroup = service.createRayonFormGroup();

        const rayon = service.getRayon(formGroup) as any;

        expect(rayon).toMatchObject({});
      });

      it('should return IRayon', () => {
        const formGroup = service.createRayonFormGroup(sampleWithRequiredData);

        const rayon = service.getRayon(formGroup) as any;

        expect(rayon).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRayon should not enable id FormControl', () => {
        const formGroup = service.createRayonFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRayon should disable id FormControl', () => {
        const formGroup = service.createRayonFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
