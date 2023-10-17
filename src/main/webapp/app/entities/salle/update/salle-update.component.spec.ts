import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SalleFormService } from './salle-form.service';
import { SalleService } from '../service/salle.service';
import { ISalle } from '../salle.model';

import { SalleUpdateComponent } from './salle-update.component';

describe('Salle Management Update Component', () => {
  let comp: SalleUpdateComponent;
  let fixture: ComponentFixture<SalleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let salleFormService: SalleFormService;
  let salleService: SalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SalleUpdateComponent],
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
      .overrideTemplate(SalleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SalleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    salleFormService = TestBed.inject(SalleFormService);
    salleService = TestBed.inject(SalleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const salle: ISalle = { id: 456 };

      activatedRoute.data = of({ salle });
      comp.ngOnInit();

      expect(comp.salle).toEqual(salle);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalle>>();
      const salle = { id: 123 };
      jest.spyOn(salleFormService, 'getSalle').mockReturnValue(salle);
      jest.spyOn(salleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salle }));
      saveSubject.complete();

      // THEN
      expect(salleFormService.getSalle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(salleService.update).toHaveBeenCalledWith(expect.objectContaining(salle));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalle>>();
      const salle = { id: 123 };
      jest.spyOn(salleFormService, 'getSalle').mockReturnValue({ id: null });
      jest.spyOn(salleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salle: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: salle }));
      saveSubject.complete();

      // THEN
      expect(salleFormService.getSalle).toHaveBeenCalled();
      expect(salleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISalle>>();
      const salle = { id: 123 };
      jest.spyOn(salleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ salle });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(salleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
