import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISalle, NewSalle } from '../salle.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISalle for edit and NewSalleFormGroupInput for create.
 */
type SalleFormGroupInput = ISalle | PartialWithRequiredKeyOf<NewSalle>;

type SalleFormDefaults = Pick<NewSalle, 'id'>;

type SalleFormGroupContent = {
  id: FormControl<ISalle['id'] | NewSalle['id']>;
  code: FormControl<ISalle['code']>;
  superficie: FormControl<ISalle['superficie']>;
};

export type SalleFormGroup = FormGroup<SalleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SalleFormService {
  createSalleFormGroup(salle: SalleFormGroupInput = { id: null }): SalleFormGroup {
    const salleRawValue = {
      ...this.getFormDefaults(),
      ...salle,
    };
    return new FormGroup<SalleFormGroupContent>({
      id: new FormControl(
        { value: salleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(salleRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      superficie: new FormControl(salleRawValue.superficie),
    });
  }

  getSalle(form: SalleFormGroup): ISalle | NewSalle {
    return form.getRawValue() as ISalle | NewSalle;
  }

  resetForm(form: SalleFormGroup, salle: SalleFormGroupInput): void {
    const salleRawValue = { ...this.getFormDefaults(), ...salle };
    form.reset(
      {
        ...salleRawValue,
        id: { value: salleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SalleFormDefaults {
    return {
      id: null,
    };
  }
}
