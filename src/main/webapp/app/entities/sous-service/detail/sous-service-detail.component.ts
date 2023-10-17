import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISousService } from '../sous-service.model';

@Component({
  selector: 'jhi-sous-service-detail',
  templateUrl: './sous-service-detail.component.html',
})
export class SousServiceDetailComponent implements OnInit {
  sousService: ISousService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sousService }) => {
      this.sousService = sousService;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
