import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BoiteDetailComponent } from './boite-detail.component';

describe('Boite Management Detail Component', () => {
  let comp: BoiteDetailComponent;
  let fixture: ComponentFixture<BoiteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoiteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ boite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BoiteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BoiteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load boite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.boite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
