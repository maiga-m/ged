import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISousService } from '../sous-service.model';
import { SousServiceService } from '../service/sous-service.service';

@Injectable({ providedIn: 'root' })
export class SousServiceRoutingResolveService implements Resolve<ISousService | null> {
  constructor(protected service: SousServiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISousService | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((sousService: HttpResponse<ISousService>) => {
          if (sousService.body) {
            return of(sousService.body);
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
