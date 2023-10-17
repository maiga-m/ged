import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalle, NewSalle } from '../salle.model';

export type PartialUpdateSalle = Partial<ISalle> & Pick<ISalle, 'id'>;

export type EntityResponseType = HttpResponse<ISalle>;
export type EntityArrayResponseType = HttpResponse<ISalle[]>;

@Injectable({ providedIn: 'root' })
export class SalleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/salles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(salle: NewSalle): Observable<EntityResponseType> {
    return this.http.post<ISalle>(this.resourceUrl, salle, { observe: 'response' });
  }

  update(salle: ISalle): Observable<EntityResponseType> {
    return this.http.put<ISalle>(`${this.resourceUrl}/${this.getSalleIdentifier(salle)}`, salle, { observe: 'response' });
  }

  partialUpdate(salle: PartialUpdateSalle): Observable<EntityResponseType> {
    return this.http.patch<ISalle>(`${this.resourceUrl}/${this.getSalleIdentifier(salle)}`, salle, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISalle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISalle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSalleIdentifier(salle: Pick<ISalle, 'id'>): number {
    return salle.id;
  }

  compareSalle(o1: Pick<ISalle, 'id'> | null, o2: Pick<ISalle, 'id'> | null): boolean {
    return o1 && o2 ? this.getSalleIdentifier(o1) === this.getSalleIdentifier(o2) : o1 === o2;
  }

  addSalleToCollectionIfMissing<Type extends Pick<ISalle, 'id'>>(
    salleCollection: Type[],
    ...sallesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const salles: Type[] = sallesToCheck.filter(isPresent);
    if (salles.length > 0) {
      const salleCollectionIdentifiers = salleCollection.map(salleItem => this.getSalleIdentifier(salleItem)!);
      const sallesToAdd = salles.filter(salleItem => {
        const salleIdentifier = this.getSalleIdentifier(salleItem);
        if (salleCollectionIdentifiers.includes(salleIdentifier)) {
          return false;
        }
        salleCollectionIdentifiers.push(salleIdentifier);
        return true;
      });
      return [...sallesToAdd, ...salleCollection];
    }
    return salleCollection;
  }
}
