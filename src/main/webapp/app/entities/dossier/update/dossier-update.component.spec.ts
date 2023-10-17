import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DossierFormService } from './dossier-form.service';
import { DossierService } from '../service/dossier.service';
import { IDossier } from '../dossier.model';
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

import { DossierUpdateComponent } from './dossier-update.component';

describe('Dossier Management Update Component', () => {
  let comp: DossierUpdateComponent;
  let fixture: ComponentFixture<DossierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dossierFormService: DossierFormService;
  let dossierService: DossierService;
  let typeDocumentService: TypeDocumentService;
  let boiteService: BoiteService;
  let processService: ProcessService;
  let serviceService: ServiceService;
  let sousServiceService: SousServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DossierUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DossierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DossierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dossierFormService = TestBed.inject(DossierFormService);
    dossierService = TestBed.inject(DossierService);
    typeDocumentService = TestBed.inject(TypeDocumentService);
    boiteService = TestBed.inject(BoiteService);
    processService = TestBed.inject(ProcessService);
    serviceService = TestBed.inject(ServiceService);
    sousServiceService = TestBed.inject(SousServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeDocument query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const typeDocument: ITypeDocument = { id: 43444 };
      dossier.typeDocument = typeDocument;

      const typeDocumentCollection: ITypeDocument[] = [{ id: 52694 }];
      jest.spyOn(typeDocumentService, 'query').mockReturnValue(of(new HttpResponse({ body: typeDocumentCollection })));
      const additionalTypeDocuments = [typeDocument];
      const expectedCollection: ITypeDocument[] = [...additionalTypeDocuments, ...typeDocumentCollection];
      jest.spyOn(typeDocumentService, 'addTypeDocumentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(typeDocumentService.query).toHaveBeenCalled();
      expect(typeDocumentService.addTypeDocumentToCollectionIfMissing).toHaveBeenCalledWith(
        typeDocumentCollection,
        ...additionalTypeDocuments.map(expect.objectContaining)
      );
      expect(comp.typeDocumentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Boite query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const boite: IBoite = { id: 97365 };
      dossier.boite = boite;

      const boiteCollection: IBoite[] = [{ id: 93327 }];
      jest.spyOn(boiteService, 'query').mockReturnValue(of(new HttpResponse({ body: boiteCollection })));
      const additionalBoites = [boite];
      const expectedCollection: IBoite[] = [...additionalBoites, ...boiteCollection];
      jest.spyOn(boiteService, 'addBoiteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(boiteService.query).toHaveBeenCalled();
      expect(boiteService.addBoiteToCollectionIfMissing).toHaveBeenCalledWith(
        boiteCollection,
        ...additionalBoites.map(expect.objectContaining)
      );
      expect(comp.boitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Process query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const process: IProcess = { id: 67477 };
      dossier.process = process;

      const processCollection: IProcess[] = [{ id: 59349 }];
      jest.spyOn(processService, 'query').mockReturnValue(of(new HttpResponse({ body: processCollection })));
      const additionalProcesses = [process];
      const expectedCollection: IProcess[] = [...additionalProcesses, ...processCollection];
      jest.spyOn(processService, 'addProcessToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(processService.query).toHaveBeenCalled();
      expect(processService.addProcessToCollectionIfMissing).toHaveBeenCalledWith(
        processCollection,
        ...additionalProcesses.map(expect.objectContaining)
      );
      expect(comp.processesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Service query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const service: IService = { id: 14992 };
      dossier.service = service;

      const serviceCollection: IService[] = [{ id: 25761 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [service];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCollection,
        ...additionalServices.map(expect.objectContaining)
      );
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SousService query and add missing value', () => {
      const dossier: IDossier = { id: 456 };
      const sousService: ISousService = { id: 5512 };
      dossier.sousService = sousService;

      const sousServiceCollection: ISousService[] = [{ id: 68131 }];
      jest.spyOn(sousServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: sousServiceCollection })));
      const additionalSousServices = [sousService];
      const expectedCollection: ISousService[] = [...additionalSousServices, ...sousServiceCollection];
      jest.spyOn(sousServiceService, 'addSousServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(sousServiceService.query).toHaveBeenCalled();
      expect(sousServiceService.addSousServiceToCollectionIfMissing).toHaveBeenCalledWith(
        sousServiceCollection,
        ...additionalSousServices.map(expect.objectContaining)
      );
      expect(comp.sousServicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dossier: IDossier = { id: 456 };
      const typeDocument: ITypeDocument = { id: 84770 };
      dossier.typeDocument = typeDocument;
      const boite: IBoite = { id: 18792 };
      dossier.boite = boite;
      const process: IProcess = { id: 14237 };
      dossier.process = process;
      const service: IService = { id: 37695 };
      dossier.service = service;
      const sousService: ISousService = { id: 12692 };
      dossier.sousService = sousService;

      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      expect(comp.typeDocumentsSharedCollection).toContain(typeDocument);
      expect(comp.boitesSharedCollection).toContain(boite);
      expect(comp.processesSharedCollection).toContain(process);
      expect(comp.servicesSharedCollection).toContain(service);
      expect(comp.sousServicesSharedCollection).toContain(sousService);
      expect(comp.dossier).toEqual(dossier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierFormService, 'getDossier').mockReturnValue(dossier);
      jest.spyOn(dossierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dossier }));
      saveSubject.complete();

      // THEN
      expect(dossierFormService.getDossier).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dossierService.update).toHaveBeenCalledWith(expect.objectContaining(dossier));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierFormService, 'getDossier').mockReturnValue({ id: null });
      jest.spyOn(dossierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dossier }));
      saveSubject.complete();

      // THEN
      expect(dossierFormService.getDossier).toHaveBeenCalled();
      expect(dossierService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDossier>>();
      const dossier = { id: 123 };
      jest.spyOn(dossierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dossier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dossierService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTypeDocument', () => {
      it('Should forward to typeDocumentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(typeDocumentService, 'compareTypeDocument');
        comp.compareTypeDocument(entity, entity2);
        expect(typeDocumentService.compareTypeDocument).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBoite', () => {
      it('Should forward to boiteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(boiteService, 'compareBoite');
        comp.compareBoite(entity, entity2);
        expect(boiteService.compareBoite).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProcess', () => {
      it('Should forward to processService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(processService, 'compareProcess');
        comp.compareProcess(entity, entity2);
        expect(processService.compareProcess).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareService', () => {
      it('Should forward to serviceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceService, 'compareService');
        comp.compareService(entity, entity2);
        expect(serviceService.compareService).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSousService', () => {
      it('Should forward to sousServiceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sousServiceService, 'compareSousService');
        comp.compareSousService(entity, entity2);
        expect(sousServiceService.compareSousService).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
