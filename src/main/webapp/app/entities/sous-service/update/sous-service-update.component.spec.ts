import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SousServiceFormService } from './sous-service-form.service';
import { SousServiceService } from '../service/sous-service.service';
import { ISousService } from '../sous-service.model';
import { IService } from 'app/entities/service/service.model';
import { ServiceService } from 'app/entities/service/service/service.service';

import { SousServiceUpdateComponent } from './sous-service-update.component';

describe('SousService Management Update Component', () => {
  let comp: SousServiceUpdateComponent;
  let fixture: ComponentFixture<SousServiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sousServiceFormService: SousServiceFormService;
  let sousServiceService: SousServiceService;
  let serviceService: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SousServiceUpdateComponent],
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
      .overrideTemplate(SousServiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SousServiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sousServiceFormService = TestBed.inject(SousServiceFormService);
    sousServiceService = TestBed.inject(SousServiceService);
    serviceService = TestBed.inject(ServiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Service query and add missing value', () => {
      const sousService: ISousService = { id: 456 };
      const service: IService = { id: 40697 };
      sousService.service = service;

      const serviceCollection: IService[] = [{ id: 41901 }];
      jest.spyOn(serviceService, 'query').mockReturnValue(of(new HttpResponse({ body: serviceCollection })));
      const additionalServices = [service];
      const expectedCollection: IService[] = [...additionalServices, ...serviceCollection];
      jest.spyOn(serviceService, 'addServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sousService });
      comp.ngOnInit();

      expect(serviceService.query).toHaveBeenCalled();
      expect(serviceService.addServiceToCollectionIfMissing).toHaveBeenCalledWith(
        serviceCollection,
        ...additionalServices.map(expect.objectContaining)
      );
      expect(comp.servicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sousService: ISousService = { id: 456 };
      const service: IService = { id: 22191 };
      sousService.service = service;

      activatedRoute.data = of({ sousService });
      comp.ngOnInit();

      expect(comp.servicesSharedCollection).toContain(service);
      expect(comp.sousService).toEqual(sousService);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISousService>>();
      const sousService = { id: 123 };
      jest.spyOn(sousServiceFormService, 'getSousService').mockReturnValue(sousService);
      jest.spyOn(sousServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sousService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sousService }));
      saveSubject.complete();

      // THEN
      expect(sousServiceFormService.getSousService).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sousServiceService.update).toHaveBeenCalledWith(expect.objectContaining(sousService));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISousService>>();
      const sousService = { id: 123 };
      jest.spyOn(sousServiceFormService, 'getSousService').mockReturnValue({ id: null });
      jest.spyOn(sousServiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sousService: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sousService }));
      saveSubject.complete();

      // THEN
      expect(sousServiceFormService.getSousService).toHaveBeenCalled();
      expect(sousServiceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISousService>>();
      const sousService = { id: 123 };
      jest.spyOn(sousServiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sousService });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sousServiceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareService', () => {
      it('Should forward to serviceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(serviceService, 'compareService');
        comp.compareService(entity, entity2);
        expect(serviceService.compareService).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
