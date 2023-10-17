import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SousServiceDetailComponent } from './sous-service-detail.component';

describe('SousService Management Detail Component', () => {
  let comp: SousServiceDetailComponent;
  let fixture: ComponentFixture<SousServiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SousServiceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sousService: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SousServiceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SousServiceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sousService on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sousService).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
