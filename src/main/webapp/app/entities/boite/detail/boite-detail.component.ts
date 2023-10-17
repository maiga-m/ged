import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBoite } from '../boite.model';

@Component({
  selector: 'jhi-boite-detail',
  templateUrl: './boite-detail.component.html',
})
export class BoiteDetailComponent implements OnInit {
  boite: IBoite | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boite }) => {
      this.boite = boite;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
