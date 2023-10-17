import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SalleFormService, SalleFormGroup } from './salle-form.service';
import { ISalle } from '../salle.model';
import { SalleService } from '../service/salle.service';

@Component({
  selector: 'jhi-salle-update',
  templateUrl: './salle-update.component.html',
})
export class SalleUpdateComponent implements OnInit {
  isSaving = false;
  salle: ISalle | null = null;

  editForm: SalleFormGroup = this.salleFormService.createSalleFormGroup();

  constructor(
    protected salleService: SalleService,
    protected salleFormService: SalleFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salle }) => {
      this.salle = salle;
      if (salle) {
        this.updateForm(salle);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salle = this.salleFormService.getSalle(this.editForm);
    if (salle.id !== null) {
      this.subscribeToSaveResponse(this.salleService.update(salle));
    } else {
      this.subscribeToSaveResponse(this.salleService.create(salle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalle>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(salle: ISalle): void {
    this.salle = salle;
    this.salleFormService.resetForm(this.editForm, salle);
  }
}
