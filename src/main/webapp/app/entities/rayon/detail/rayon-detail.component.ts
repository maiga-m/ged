import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRayon } from '../rayon.model';

@Component({
  selector: 'jhi-rayon-detail',
  templateUrl: './rayon-detail.component.html',
})
export class RayonDetailComponent implements OnInit {
  rayon: IRayon | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rayon }) => {
      this.rayon = rayon;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
