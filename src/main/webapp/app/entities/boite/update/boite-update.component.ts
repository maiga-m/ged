import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BoiteFormService, BoiteFormGroup } from './boite-form.service';
import { IBoite } from '../boite.model';
import { BoiteService } from '../service/boite.service';
import { IRayon } from 'app/entities/rayon/rayon.model';
import { RayonService } from 'app/entities/rayon/service/rayon.service';

@Component({
  selector: 'jhi-boite-update',
  templateUrl: './boite-update.component.html',
})
export class BoiteUpdateComponent implements OnInit {
  isSaving = false;
  boite: IBoite | null = null;

  rayonsSharedCollection: IRayon[] = [];

  editForm: BoiteFormGroup = this.boiteFormService.createBoiteFormGroup();

  constructor(
    protected boiteService: BoiteService,
    protected boiteFormService: BoiteFormService,
    protected rayonService: RayonService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRayon = (o1: IRayon | null, o2: IRayon | null): boolean => this.rayonService.compareRayon(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boite }) => {
      this.boite = boite;
      if (boite) {
        this.updateForm(boite);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boite = this.boiteFormService.getBoite(this.editForm);
    if (boite.id !== null) {
      this.subscribeToSaveResponse(this.boiteService.update(boite));
    } else {
      this.subscribeToSaveResponse(this.boiteService.create(boite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBoite>>): void {
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

  protected updateForm(boite: IBoite): void {
    this.boite = boite;
    this.boiteFormService.resetForm(this.editForm, boite);

    this.rayonsSharedCollection = this.rayonService.addRayonToCollectionIfMissing<IRayon>(this.rayonsSharedCollection, boite.rayon);
  }

  protected loadRelationshipsOptions(): void {
    this.rayonService
      .query()
      .pipe(map((res: HttpResponse<IRayon[]>) => res.body ?? []))
      .pipe(map((rayons: IRayon[]) => this.rayonService.addRayonToCollectionIfMissing<IRayon>(rayons, this.boite?.rayon)))
      .subscribe((rayons: IRayon[]) => (this.rayonsSharedCollection = rayons));
  }
}
