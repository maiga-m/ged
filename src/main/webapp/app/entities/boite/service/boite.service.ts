import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoite, NewBoite } from '../boite.model';

export type PartialUpdateBoite = Partial<IBoite> & Pick<IBoite, 'id'>;

export type EntityResponseType = HttpResponse<IBoite>;
export type EntityArrayResponseType = HttpResponse<IBoite[]>;

@Injectable({ providedIn: 'root' })
export class BoiteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/boites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(boite: NewBoite): Observable<EntityResponseType> {
    return this.http.post<IBoite>(this.resourceUrl, boite, { observe: 'response' });
  }

  update(boite: IBoite): Observable<EntityResponseType> {
    return this.http.put<IBoite>(`${this.resourceUrl}/${this.getBoiteIdentifier(boite)}`, boite, { observe: 'response' });
  }

  partialUpdate(boite: PartialUpdateBoite): Observable<EntityResponseType> {
    return this.http.patch<IBoite>(`${this.resourceUrl}/${this.getBoiteIdentifier(boite)}`, boite, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBoite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBoiteIdentifier(boite: Pick<IBoite, 'id'>): number {
    return boite.id;
  }

  compareBoite(o1: Pick<IBoite, 'id'> | null, o2: Pick<IBoite, 'id'> | null): boolean {
    return o1 && o2 ? this.getBoiteIdentifier(o1) === this.getBoiteIdentifier(o2) : o1 === o2;
  }

  addBoiteToCollectionIfMissing<Type extends Pick<IBoite, 'id'>>(
    boiteCollection: Type[],
    ...boitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const boites: Type[] = boitesToCheck.filter(isPresent);
    if (boites.length > 0) {
      const boiteCollectionIdentifiers = boiteCollection.map(boiteItem => this.getBoiteIdentifier(boiteItem)!);
      const boitesToAdd = boites.filter(boiteItem => {
        const boiteIdentifier = this.getBoiteIdentifier(boiteItem);
        if (boiteCollectionIdentifiers.includes(boiteIdentifier)) {
          return false;
        }
        boiteCollectionIdentifiers.push(boiteIdentifier);
        return true;
      });
      return [...boitesToAdd, ...boiteCollection];
    }
    return boiteCollection;
  }
}
