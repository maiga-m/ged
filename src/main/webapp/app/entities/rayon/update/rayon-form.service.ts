import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRayon, NewRayon } from '../rayon.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRayon for edit and NewRayonFormGroupInput for create.
 */
type RayonFormGroupInput = IRayon | PartialWithRequiredKeyOf<NewRayon>;

type RayonFormDefaults = Pick<NewRayon, 'id'>;

type RayonFormGroupContent = {
  id: FormControl<IRayon['id'] | NewRayon['id']>;
  code: FormControl<IRayon['code']>;
  nom: FormControl<IRayon['nom']>;
  salle: FormControl<IRayon['salle']>;
};

export type RayonFormGroup = FormGroup<RayonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RayonFormService {
  createRayonFormGroup(rayon: RayonFormGroupInput = { id: null }): RayonFormGroup {
    const rayonRawValue = {
      ...this.getFormDefaults(),
      ...rayon,
    };
    return new FormGroup<RayonFormGroupContent>({
      id: new FormControl(
        { value: rayonRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(rayonRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      nom: new FormControl(rayonRawValue.nom, {
        validators: [Validators.maxLength(30)],
      }),
      salle: new FormControl(rayonRawValue.salle),
    });
  }

  getRayon(form: RayonFormGroup): IRayon | NewRayon {
    return form.getRawValue() as IRayon | NewRayon;
  }

  resetForm(form: RayonFormGroup, rayon: RayonFormGroupInput): void {
    const rayonRawValue = { ...this.getFormDefaults(), ...rayon };
    form.reset(
      {
        ...rayonRawValue,
        id: { value: rayonRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RayonFormDefaults {
    return {
      id: null,
    };
  }
}
