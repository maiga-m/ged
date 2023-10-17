import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDossier } from '../dossier.model';

@Component({
  selector: 'jhi-dossier-detail',
  templateUrl: './dossier-detail.component.html',
})
export class DossierDetailComponent implements OnInit {
  dossier: IDossier | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dossier }) => {
      this.dossier = dossier;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
