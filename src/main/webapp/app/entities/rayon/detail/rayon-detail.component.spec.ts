import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RayonDetailComponent } from './rayon-detail.component';

describe('Rayon Management Detail Component', () => {
  let comp: RayonDetailComponent;
  let fixture: ComponentFixture<RayonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RayonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ rayon: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RayonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RayonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load rayon on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.rayon).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
