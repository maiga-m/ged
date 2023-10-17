import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RayonFormService } from './rayon-form.service';
import { RayonService } from '../service/rayon.service';
import { IRayon } from '../rayon.model';
import { ISalle } from 'app/entities/salle/salle.model';
import { SalleService } from 'app/entities/salle/service/salle.service';

import { RayonUpdateComponent } from './rayon-update.component';

describe('Rayon Management Update Component', () => {
  let comp: RayonUpdateComponent;
  let fixture: ComponentFixture<RayonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rayonFormService: RayonFormService;
  let rayonService: RayonService;
  let salleService: SalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RayonUpdateComponent],
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
      .overrideTemplate(RayonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RayonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rayonFormService = TestBed.inject(RayonFormService);
    rayonService = TestBed.inject(RayonService);
    salleService = TestBed.inject(SalleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Salle query and add missing value', () => {
      const rayon: IRayon = { id: 456 };
      const salle: ISalle = { id: 90810 };
      rayon.salle = salle;

      const salleCollection: ISalle[] = [{ id: 95585 }];
      jest.spyOn(salleService, 'query').mockReturnValue(of(new HttpResponse({ body: salleCollection })));
      const additionalSalles = [salle];
      const expectedCollection: ISalle[] = [...additionalSalles, ...salleCollection];
      jest.spyOn(salleService, 'addSalleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ rayon });
      comp.ngOnInit();

      expect(salleService.query).toHaveBeenCalled();
      expect(salleService.addSalleToCollectionIfMissing).toHaveBeenCalledWith(
        salleCollection,
        ...additionalSalles.map(expect.objectContaining)
      );
      expect(comp.sallesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const rayon: IRayon = { id: 456 };
      const salle: ISalle = { id: 24192 };
      rayon.salle = salle;

      activatedRoute.data = of({ rayon });
      comp.ngOnInit();

      expect(comp.sallesSharedCollection).toContain(salle);
      expect(comp.rayon).toEqual(rayon);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRayon>>();
      const rayon = { id: 123 };
      jest.spyOn(rayonFormService, 'getRayon').mockReturnValue(rayon);
      jest.spyOn(rayonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rayon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rayon }));
      saveSubject.complete();

      // THEN
      expect(rayonFormService.getRayon).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rayonService.update).toHaveBeenCalledWith(expect.objectContaining(rayon));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRayon>>();
      const rayon = { id: 123 };
      jest.spyOn(rayonFormService, 'getRayon').mockReturnValue({ id: null });
      jest.spyOn(rayonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rayon: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rayon }));
      saveSubject.complete();

      // THEN
      expect(rayonFormService.getRayon).toHaveBeenCalled();
      expect(rayonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRayon>>();
      const rayon = { id: 123 };
      jest.spyOn(rayonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rayon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rayonService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSalle', () => {
      it('Should forward to salleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(salleService, 'compareSalle');
        comp.compareSalle(entity, entity2);
        expect(salleService.compareSalle).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
