import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISousService, NewSousService } from '../sous-service.model';

export type PartialUpdateSousService = Partial<ISousService> & Pick<ISousService, 'id'>;

export type EntityResponseType = HttpResponse<ISousService>;
export type EntityArrayResponseType = HttpResponse<ISousService[]>;

@Injectable({ providedIn: 'root' })
export class SousServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sous-services');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sousService: NewSousService): Observable<EntityResponseType> {
    return this.http.post<ISousService>(this.resourceUrl, sousService, { observe: 'response' });
  }

  update(sousService: ISousService): Observable<EntityResponseType> {
    return this.http.put<ISousService>(`${this.resourceUrl}/${this.getSousServiceIdentifier(sousService)}`, sousService, {
      observe: 'response',
    });
  }

  partialUpdate(sousService: PartialUpdateSousService): Observable<EntityResponseType> {
    return this.http.patch<ISousService>(`${this.resourceUrl}/${this.getSousServiceIdentifier(sousService)}`, sousService, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISousService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISousService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSousServiceIdentifier(sousService: Pick<ISousService, 'id'>): number {
    return sousService.id;
  }

  compareSousService(o1: Pick<ISousService, 'id'> | null, o2: Pick<ISousService, 'id'> | null): boolean {
    return o1 && o2 ? this.getSousServiceIdentifier(o1) === this.getSousServiceIdentifier(o2) : o1 === o2;
  }

  addSousServiceToCollectionIfMissing<Type extends Pick<ISousService, 'id'>>(
    sousServiceCollection: Type[],
    ...sousServicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sousServices: Type[] = sousServicesToCheck.filter(isPresent);
    if (sousServices.length > 0) {
      const sousServiceCollectionIdentifiers = sousServiceCollection.map(
        sousServiceItem => this.getSousServiceIdentifier(sousServiceItem)!
      );
      const sousServicesToAdd = sousServices.filter(sousServiceItem => {
        const sousServiceIdentifier = this.getSousServiceIdentifier(sousServiceItem);
        if (sousServiceCollectionIdentifiers.includes(sousServiceIdentifier)) {
          return false;
        }
        sousServiceCollectionIdentifiers.push(sousServiceIdentifier);
        return true;
      });
      return [...sousServicesToAdd, ...sousServiceCollection];
    }
    return sousServiceCollection;
  }
}
