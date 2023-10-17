import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRayon } from '../rayon.model';
import { RayonService } from '../service/rayon.service';

@Injectable({ providedIn: 'root' })
export class RayonRoutingResolveService implements Resolve<IRayon | null> {
  constructor(protected service: RayonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRayon | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((rayon: HttpResponse<IRayon>) => {
          if (rayon.body) {
            return of(rayon.body);
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
