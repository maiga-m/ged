import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRayon, NewRayon } from '../rayon.model';

export type PartialUpdateRayon = Partial<IRayon> & Pick<IRayon, 'id'>;

export type EntityResponseType = HttpResponse<IRayon>;
export type EntityArrayResponseType = HttpResponse<IRayon[]>;

@Injectable({ providedIn: 'root' })
export class RayonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rayons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(rayon: NewRayon): Observable<EntityResponseType> {
    return this.http.post<IRayon>(this.resourceUrl, rayon, { observe: 'response' });
  }

  update(rayon: IRayon): Observable<EntityResponseType> {
    return this.http.put<IRayon>(`${this.resourceUrl}/${this.getRayonIdentifier(rayon)}`, rayon, { observe: 'response' });
  }

  partialUpdate(rayon: PartialUpdateRayon): Observable<EntityResponseType> {
    return this.http.patch<IRayon>(`${this.resourceUrl}/${this.getRayonIdentifier(rayon)}`, rayon, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRayon>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRayon[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRayonIdentifier(rayon: Pick<IRayon, 'id'>): number {
    return rayon.id;
  }

  compareRayon(o1: Pick<IRayon, 'id'> | null, o2: Pick<IRayon, 'id'> | null): boolean {
    return o1 && o2 ? this.getRayonIdentifier(o1) === this.getRayonIdentifier(o2) : o1 === o2;
  }

  addRayonToCollectionIfMissing<Type extends Pick<IRayon, 'id'>>(
    rayonCollection: Type[],
    ...rayonsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rayons: Type[] = rayonsToCheck.filter(isPresent);
    if (rayons.length > 0) {
      const rayonCollectionIdentifiers = rayonCollection.map(rayonItem => this.getRayonIdentifier(rayonItem)!);
      const rayonsToAdd = rayons.filter(rayonItem => {
        const rayonIdentifier = this.getRayonIdentifier(rayonItem);
        if (rayonCollectionIdentifiers.includes(rayonIdentifier)) {
          return false;
        }
        rayonCollectionIdentifiers.push(rayonIdentifier);
        return true;
      });
      return [...rayonsToAdd, ...rayonCollection];
    }
    return rayonCollection;
  }
}
