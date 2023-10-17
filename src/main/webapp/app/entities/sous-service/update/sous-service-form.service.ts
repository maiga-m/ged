import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISousService, NewSousService } from '../sous-service.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISousService for edit and NewSousServiceFormGroupInput for create.
 */
type SousServiceFormGroupInput = ISousService | PartialWithRequiredKeyOf<NewSousService>;

type SousServiceFormDefaults = Pick<NewSousService, 'id'>;

type SousServiceFormGroupContent = {
  id: FormControl<ISousService['id'] | NewSousService['id']>;
  code: FormControl<ISousService['code']>;
  nom: FormControl<ISousService['nom']>;
  service: FormControl<ISousService['service']>;
};

export type SousServiceFormGroup = FormGroup<SousServiceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SousServiceFormService {
  createSousServiceFormGroup(sousService: SousServiceFormGroupInput = { id: null }): SousServiceFormGroup {
    const sousServiceRawValue = {
      ...this.getFormDefaults(),
      ...sousService,
    };
    return new FormGroup<SousServiceFormGroupContent>({
      id: new FormControl(
        { value: sousServiceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(sousServiceRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      nom: new FormControl(sousServiceRawValue.nom, {
        validators: [Validators.maxLength(30)],
      }),
      service: new FormControl(sousServiceRawValue.service),
    });
  }

  getSousService(form: SousServiceFormGroup): ISousService | NewSousService {
    return form.getRawValue() as ISousService | NewSousService;
  }

  resetForm(form: SousServiceFormGroup, sousService: SousServiceFormGroupInput): void {
    const sousServiceRawValue = { ...this.getFormDefaults(), ...sousService };
    form.reset(
      {
        ...sousServiceRawValue,
        id: { value: sousServiceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SousServiceFormDefaults {
    return {
      id: null,
    };
  }
}
