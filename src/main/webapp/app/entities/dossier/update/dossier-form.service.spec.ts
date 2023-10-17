import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dossier.test-samples';

import { DossierFormService } from './dossier-form.service';

describe('Dossier Form Service', () => {
  let service: DossierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierFormService);
  });

  describe('Service methods', () => {
    describe('createDossierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDossierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            motCle: expect.any(Object),
            dateProduction: expect.any(Object),
            typeDocument: expect.any(Object),
            boite: expect.any(Object),
            process: expect.any(Object),
            service: expect.any(Object),
            sousService: expect.any(Object),
          })
        );
      });

      it('passing IDossier should create a new form with FormGroup', () => {
        const formGroup = service.createDossierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            motCle: expect.any(Object),
            dateProduction: expect.any(Object),
            typeDocument: expect.any(Object),
            boite: expect.any(Object),
            process: expect.any(Object),
            service: expect.any(Object),
            sousService: expect.any(Object),
          })
        );
      });
    });

    describe('getDossier', () => {
      it('should return NewDossier for default Dossier initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDossierFormGroup(sampleWithNewData);

        const dossier = service.getDossier(formGroup) as any;

        expect(dossier).toMatchObject(sampleWithNewData);
      });

      it('should return NewDossier for empty Dossier initial value', () => {
        const formGroup = service.createDossierFormGroup();

        const dossier = service.getDossier(formGroup) as any;

        expect(dossier).toMatchObject({});
      });

      it('should return IDossier', () => {
        const formGroup = service.createDossierFormGroup(sampleWithRequiredData);

        const dossier = service.getDossier(formGroup) as any;

        expect(dossier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDossier should not enable id FormControl', () => {
        const formGroup = service.createDossierFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDossier should disable id FormControl', () => {
        const formGroup = service.createDossierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
