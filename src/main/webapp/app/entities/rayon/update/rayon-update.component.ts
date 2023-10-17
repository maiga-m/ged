import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RayonFormService, RayonFormGroup } from './rayon-form.service';
import { IRayon } from '../rayon.model';
import { RayonService } from '../service/rayon.service';
import { ISalle } from 'app/entities/salle/salle.model';
import { SalleService } from 'app/entities/salle/service/salle.service';

@Component({
  selector: 'jhi-rayon-update',
  templateUrl: './rayon-update.component.html',
})
export class RayonUpdateComponent implements OnInit {
  isSaving = false;
  rayon: IRayon | null = null;

  sallesSharedCollection: ISalle[] = [];

  editForm: RayonFormGroup = this.rayonFormService.createRayonFormGroup();

  constructor(
    protected rayonService: RayonService,
    protected rayonFormService: RayonFormService,
    protected salleService: SalleService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSalle = (o1: ISalle | null, o2: ISalle | null): boolean => this.salleService.compareSalle(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rayon }) => {
      this.rayon = rayon;
      if (rayon) {
        this.updateForm(rayon);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rayon = this.rayonFormService.getRayon(this.editForm);
    if (rayon.id !== null) {
      this.subscribeToSaveResponse(this.rayonService.update(rayon));
    } else {
      this.subscribeToSaveResponse(this.rayonService.create(rayon));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRayon>>): void {
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

  protected updateForm(rayon: IRayon): void {
    this.rayon = rayon;
    this.rayonFormService.resetForm(this.editForm, rayon);

    this.sallesSharedCollection = this.salleService.addSalleToCollectionIfMissing<ISalle>(this.sallesSharedCollection, rayon.salle);
  }

  protected loadRelationshipsOptions(): void {
    this.salleService
      .query()
      .pipe(map((res: HttpResponse<ISalle[]>) => res.body ?? []))
      .pipe(map((salles: ISalle[]) => this.salleService.addSalleToCollectionIfMissing<ISalle>(salles, this.rayon?.salle)))
      .subscribe((salles: ISalle[]) => (this.sallesSharedCollection = salles));
  }
}
