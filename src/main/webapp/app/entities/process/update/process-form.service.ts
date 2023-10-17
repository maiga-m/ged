import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProcess, NewProcess } from '../process.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProcess for edit and NewProcessFormGroupInput for create.
 */
type ProcessFormGroupInput = IProcess | PartialWithRequiredKeyOf<NewProcess>;

type ProcessFormDefaults = Pick<NewProcess, 'id'>;

type ProcessFormGroupContent = {
  id: FormControl<IProcess['id'] | NewProcess['id']>;
  code: FormControl<IProcess['code']>;
  nom: FormControl<IProcess['nom']>;
};

export type ProcessFormGroup = FormGroup<ProcessFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProcessFormService {
  createProcessFormGroup(process: ProcessFormGroupInput = { id: null }): ProcessFormGroup {
    const processRawValue = {
      ...this.getFormDefaults(),
      ...process,
    };
    return new FormGroup<ProcessFormGroupContent>({
      id: new FormControl(
        { value: processRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(processRawValue.code, {
        validators: [Validators.maxLength(10)],
      }),
      nom: new FormControl(processRawValue.nom, {
        validators: [Validators.maxLength(30)],
      }),
    });
  }

  getProcess(form: ProcessFormGroup): IProcess | NewProcess {
    return form.getRawValue() as IProcess | NewProcess;
  }

  resetForm(form: ProcessFormGroup, process: ProcessFormGroupInput): void {
    const processRawValue = { ...this.getFormDefaults(), ...process };
    form.reset(
      {
        ...processRawValue,
        id: { value: processRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProcessFormDefaults {
    return {
      id: null,
    };
  }
}
