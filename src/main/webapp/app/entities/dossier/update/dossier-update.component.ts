import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DossierFormService, DossierFormGroup } from './dossier-form.service';
import { IDossier } from '../dossier.model';
import { DossierService } from '../service/dossier.service';
import { ITypeDocument } from 'app/entities/type-document/type-document.model';
import { TypeDocumentService } from 'app/entities/type-document/service/type-document.service';
import { IBoite } from 'app/entities/boite/boite.model';
import { BoiteService } from 'app/entities/boite/service/boite.service';
import { IProcess } from 'app/entities/process/process.model';
import { ProcessService } from 'app/entities/process/service/process.service';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';
import { ISousService } from 'app/entities/sous-service/sous-service.model';
import { SousServiceService } from 'app/entities/sous-service/service/sous-service.service';

@Component({
  selector: 'jhi-dossier-update',
  templateUrl: './dossier-update.component.html',
})
export class DossierUpdateComponent implements OnInit {
  isSaving = false;
  dossier: IDossier | null = null;

  typeDocumentsSharedCollection: ITypeDocument[] = [];
  boitesSharedCollection: IBoite[] = [];
  processesSharedCollection: IProcess[] = [];
  servicesSharedCollection: IService[] = [];
  sousServicesSharedCollection: ISousService[] = [];

  editForm: DossierFormGroup = this.dossierFormService.createDossierFormGroup();

  constructor(
    protected dossierService: DossierService,
    protected dossierFormService: DossierFormService,
    protected typeDocumentService: TypeDocumentService,
    protected boiteService: BoiteService,
    protected processService: ProcessService,
    protected serviceService: ServiceService,
    protected sousServiceService: SousServiceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTypeDocument = (o1: ITypeDocument | null, o2: ITypeDocument | null): boolean =>
    this.typeDocumentService.compareTypeDocument(o1, o2);

  compareBoite = (o1: IBoite | null, o2: IBoite | null): boolean => this.boiteService.compareBoite(o1, o2);

  compareProcess = (o1: IProcess | null, o2: IProcess | null): boolean => this.processService.compareProcess(o1, o2);

  compareService = (o1: IService | null, o2: IService | null): boolean => this.serviceService.compareService(o1, o2);

  compareSousService = (o1: ISousService | null, o2: ISousService | null): boolean => this.sousServiceService.compareSousService(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dossier }) => {
      this.dossier = dossier;
      if (dossier) {
        this.updateForm(dossier);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dossier = this.dossierFormService.getDossier(this.editForm);
    if (dossier.id !== null) {
      this.subscribeToSaveResponse(this.dossierService.update(dossier));
    } else {
      this.subscribeToSaveResponse(this.dossierService.create(dossier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDossier>>): void {
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

  protected updateForm(dossier: IDossier): void {
    this.dossier = dossier;
    this.dossierFormService.resetForm(this.editForm, dossier);

    this.typeDocumentsSharedCollection = this.typeDocumentService.addTypeDocumentToCollectionIfMissing<ITypeDocument>(
      this.typeDocumentsSharedCollection,
      dossier.typeDocument
    );
    this.boitesSharedCollection = this.boiteService.addBoiteToCollectionIfMissing<IBoite>(this.boitesSharedCollection, dossier.boite);
    this.processesSharedCollection = this.processService.addProcessToCollectionIfMissing<IProcess>(
      this.processesSharedCollection,
      dossier.process
    );
    this.servicesSharedCollection = this.serviceService.addServiceToCollectionIfMissing<IService>(
      this.servicesSharedCollection,
      dossier.service
    );
    this.sousServicesSharedCollection = this.sousServiceService.addSousServiceToCollectionIfMissing<ISousService>(
      this.sousServicesSharedCollection,
      dossier.sousService
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typeDocumentService
      .query()
      .pipe(map((res: HttpResponse<ITypeDocument[]>) => res.body ?? []))
      .pipe(
        map((typeDocuments: ITypeDocument[]) =>
          this.typeDocumentService.addTypeDocumentToCollectionIfMissing<ITypeDocument>(typeDocuments, this.dossier?.typeDocument)
        )
      )
      .subscribe((typeDocuments: ITypeDocument[]) => (this.typeDocumentsSharedCollection = typeDocuments));

    this.boiteService
      .query()
      .pipe(map((res: HttpResponse<IBoite[]>) => res.body ?? []))
      .pipe(map((boites: IBoite[]) => this.boiteService.addBoiteToCollectionIfMissing<IBoite>(boites, this.dossier?.boite)))
      .subscribe((boites: IBoite[]) => (this.boitesSharedCollection = boites));

    this.processService
      .query()
      .pipe(map((res: HttpResponse<IProcess[]>) => res.body ?? []))
      .pipe(map((processes: IProcess[]) => this.processService.addProcessToCollectionIfMissing<IProcess>(processes, this.dossier?.process)))
      .subscribe((processes: IProcess[]) => (this.processesSharedCollection = processes));

    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((services: IService[]) => this.serviceService.addServiceToCollectionIfMissing<IService>(services, this.dossier?.service)))
      .subscribe((services: IService[]) => (this.servicesSharedCollection = services));

    this.sousServiceService
      .query()
      .pipe(map((res: HttpResponse<ISousService[]>) => res.body ?? []))
      .pipe(
        map((sousServices: ISousService[]) =>
          this.sousServiceService.addSousServiceToCollectionIfMissing<ISousService>(sousServices, this.dossier?.sousService)
        )
      )
      .subscribe((sousServices: ISousService[]) => (this.sousServicesSharedCollection = sousServices));
  }
}
