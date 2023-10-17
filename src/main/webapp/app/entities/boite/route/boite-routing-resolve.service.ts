import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBoite } from '../boite.model';
import { BoiteService } from '../service/boite.service';

@Injectable({ providedIn: 'root' })
export class BoiteRoutingResolveService implements Resolve<IBoite | null> {
  constructor(protected service: BoiteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBoite | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((boite: HttpResponse<IBoite>) => {
          if (boite.body) {
            return of(boite.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
