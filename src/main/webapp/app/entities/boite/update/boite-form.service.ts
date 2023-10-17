import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBoite, NewBoite } from '../boite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBoite for edit and NewBoiteFormGroupInput for create.
 */
type BoiteFormGroupInput = IBoite | PartialWithRequiredKeyOf<NewBoite>;

type BoiteFormDefaults = Pick<NewBoite, 'id'>;

type BoiteFormGroupContent = {
  id: FormControl<IBoite['id'] | NewBoite['id']>;
  code: FormControl<IBoite['code']>;
  capacite: FormControl<IBoite['capacite']>;
  rayon: FormControl<IBoite['rayon']>;
};

export type BoiteFormGroup = FormGroup<BoiteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BoiteFormService {
  createBoiteFormGroup(boite: BoiteFormGroupInput = { id: null }): BoiteFormGroup {
    const boiteRawValue = {
      ...this.getFormDefaults(),
      ...boite,
    };
    return new FormGroup<BoiteFormGroupContent>({
      id: new FormControl(
        { value: boiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(boiteRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      capacite: new FormControl(boiteRawValue.capacite),
      rayon: new FormControl(boiteRawValue.rayon),
    });
  }

  getBoite(form: BoiteFormGroup): IBoite | NewBoite {
    return form.getRawValue() as IBoite | NewBoite;
  }

  resetForm(form: BoiteFormGroup, boite: BoiteFormGroupInput): void {
    const boiteRawValue = { ...this.getFormDefaults(), ...boite };
    form.reset(
      {
        ...boiteRawValue,
        id: { value: boiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BoiteFormDefaults {
    return {
      id: null,
    };
  }
}
