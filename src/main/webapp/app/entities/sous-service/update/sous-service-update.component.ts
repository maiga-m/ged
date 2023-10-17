import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SousServiceFormService, SousServiceFormGroup } from './sous-service-form.service';
import { ISousService } from '../sous-service.model';
import { SousServiceService } from '../service/sous-service.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  selector: 'jhi-sous-service-update',
  templateUrl: './sous-service-update.component.html',
})
export class SousServiceUpdateComponent implements OnInit {
  isSaving = false;
  sousService: ISousService | null = null;

  servicesSharedCollection: IService[] = [];

  editForm: SousServiceFormGroup = this.sousServiceFormService.createSousServiceFormGroup();

  constructor(
    protected sousServiceService: SousServiceService,
    protected sousServiceFormService: SousServiceFormService,
    protected serviceService: ServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sousService }) => {
      this.sousService = sousService;
      if (sousService) {
        this.updateForm(sousService);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sousService = this.sousServiceFormService.getSousService(this.editForm);
    if (sousService.id !== null) {
      this.subscribeToSaveResponse(this.sousServiceService.update(sousService));
    } else {
      this.subscribeToSaveResponse(this.sousServiceService.create(sousService));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISousService>>): void {
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

  protected updateForm(sousService: ISousService): void {
    this.sousService = sousService;
    this.sousServiceFormService.resetForm(this.editForm, sousService);

    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(
      this.servicesSharedCollection,
      sousService.service
    );
  }

  protected loadRelationshipsOptions(): void {
    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(
        map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.sousService?.service))
      )
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));
  }
}
