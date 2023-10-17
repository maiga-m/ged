import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDossier, NewDossier } from '../dossier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDossier for edit and NewDossierFormGroupInput for create.
 */
type DossierFormGroupInput = IDossier | PartialWithRequiredKeyOf<NewDossier>;

type DossierFormDefaults = Pick<NewDossier, 'id'>;

type DossierFormGroupContent = {
  id: FormControl<IDossier['id'] | NewDossier['id']>;
  code: FormControl<IDossier['code']>;
  motCle: FormControl<IDossier['motCle']>;
  dateProduction: FormControl<IDossier['dateProduction']>;
  typeDocument: FormControl<IDossier['typeDocument']>;
  boite: FormControl<IDossier['boite']>;
  process: FormControl<IDossier['process']>;
  service: FormControl<IDossier['service']>;
  sousService: FormControl<IDossier['sousService']>;
};

export type DossierFormGroup = FormGroup<DossierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DossierFormService {
  createDossierFormGroup(dossier: DossierFormGroupInput = { id: null }): DossierFormGroup {
    const dossierRawValue = {
      ...this.getFormDefaults(),
      ...dossier,
    };
    return new FormGroup<DossierFormGroupContent>({
      id: new FormControl(
        { value: dossierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(dossierRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      motCle: new FormControl(dossierRawValue.motCle, {
        validators: [Validators.maxLength(30)],
      }),
      dateProduction: new FormControl(dossierRawValue.dateProduction),
      typeDocument: new FormControl(dossierRawValue.typeDocument),
      boite: new FormControl(dossierRawValue.boite),
      process: new FormControl(dossierRawValue.process),
      service: new FormControl(dossierRawValue.service),
      sousService: new FormControl(dossierRawValue.sousService),
    });
  }

  getDossier(form: DossierFormGroup): IDossier | NewDossier {
    return form.getRawValue() as IDossier | NewDossier;
  }

  resetForm(form: DossierFormGroup, dossier: DossierFormGroupInput): void {
    const dossierRawValue = { ...this.getFormDefaults(), ...dossier };
    form.reset(
      {
        ...dossierRawValue,
        id: { value: dossierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DossierFormDefaults {
    return {
      id: null,
    };
  }
}
