import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BoiteFormService } from './boite-form.service';
import { BoiteService } from '../service/boite.service';
import { IBoite } from '../boite.model';
import { IRayon } from 'app/entities/rayon/rayon.model';
import { RayonService } from 'app/entities/rayon/service/rayon.service';

import { BoiteUpdateComponent } from './boite-update.component';

describe('Boite Management Update Component', () => {
  let comp: BoiteUpdateComponent;
  let fixture: ComponentFixture<BoiteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let boiteFormService: BoiteFormService;
  let boiteService: BoiteService;
  let rayonService: RayonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BoiteUpdateComponent],
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
      .overrideTemplate(BoiteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BoiteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    boiteFormService = TestBed.inject(BoiteFormService);
    boiteService = TestBed.inject(BoiteService);
    rayonService = TestBed.inject(RayonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Rayon query and add missing value', () => {
      const boite: IBoite = { id: 456 };
      const rayon: IRayon = { id: 69119 };
      boite.rayon = rayon;

      const rayonCollection: IRayon[] = [{ id: 50979 }];
      jest.spyOn(rayonService, 'query').mockReturnValue(of(new HttpResponse({ body: rayonCollection })));
      const additionalRayons = [rayon];
      const expectedCollection: IRayon[] = [...additionalRayons, ...rayonCollection];
      jest.spyOn(rayonService, 'addRayonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ boite });
      comp.ngOnInit();

      expect(rayonService.query).toHaveBeenCalled();
      expect(rayonService.addRayonToCollectionIfMissing).toHaveBeenCalledWith(
        rayonCollection,
        ...additionalRayons.map(expect.objectContaining)
      );
      expect(comp.rayonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const boite: IBoite = { id: 456 };
      const rayon: IRayon = { id: 47719 };
      boite.rayon = rayon;

      activatedRoute.data = of({ boite });
      comp.ngOnInit();

      expect(comp.rayonsSharedCollection).toContain(rayon);
      expect(comp.boite).toEqual(boite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoite>>();
      const boite = { id: 123 };
      jest.spyOn(boiteFormService, 'getBoite').mockReturnValue(boite);
      jest.spyOn(boiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boite }));
      saveSubject.complete();

      // THEN
      expect(boiteFormService.getBoite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(boiteService.update).toHaveBeenCalledWith(expect.objectContaining(boite));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoite>>();
      const boite = { id: 123 };
      jest.spyOn(boiteFormService, 'getBoite').mockReturnValue({ id: null });
      jest.spyOn(boiteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boite: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boite }));
      saveSubject.complete();

      // THEN
      expect(boiteFormService.getBoite).toHaveBeenCalled();
      expect(boiteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoite>>();
      const boite = { id: 123 };
      jest.spyOn(boiteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(boiteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRayon', () => {
      it('Should forward to rayonService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(rayonService, 'compareRayon');
        comp.compareRayon(entity, entity2);
        expect(rayonService.compareRayon).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
