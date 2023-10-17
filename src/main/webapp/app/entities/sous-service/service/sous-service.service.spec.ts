import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISousService } from '../sous-service.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sous-service.test-samples';

import { SousServiceService } from './sous-service.service';

const requireRestSample: ISousService = {
  ...sampleWithRequiredData,
};

describe('SousService Service', () => {
  let service: SousServiceService;
  let httpMock: HttpTestingController;
  let expectedResult: ISousService | ISousService[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SousServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SousService', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sousService = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sousService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SousService', () => {
      const sousService = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sousService).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SousService', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SousService', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SousService', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSousServiceToCollectionIfMissing', () => {
      it('should add a SousService to an empty array', () => {
        const sousService: ISousService = sampleWithRequiredData;
        expectedResult = service.addSousServiceToCollectionIfMissing([], sousService);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sousService);
      });

      it('should not add a SousService to an array that contains it', () => {
        const sousService: ISousService = sampleWithRequiredData;
        const sousServiceCollection: ISousService[] = [
          {
            ...sousService,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSousServiceToCollectionIfMissing(sousServiceCollection, sousService);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SousService to an array that doesn't contain it", () => {
        const sousService: ISousService = sampleWithRequiredData;
        const sousServiceCollection: ISousService[] = [sampleWithPartialData];
        expectedResult = service.addSousServiceToCollectionIfMissing(sousServiceCollection, sousService);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sousService);
      });

      it('should add only unique SousService to an array', () => {
        const sousServiceArray: ISousService[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sousServiceCollection: ISousService[] = [sampleWithRequiredData];
        expectedResult = service.addSousServiceToCollectionIfMissing(sousServiceCollection, ...sousServiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sousService: ISousService = sampleWithRequiredData;
        const sousService2: ISousService = sampleWithPartialData;
        expectedResult = service.addSousServiceToCollectionIfMissing([], sousService, sousService2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sousService);
        expect(expectedResult).toContain(sousService2);
      });

      it('should accept null and undefined values', () => {
        const sousService: ISousService = sampleWithRequiredData;
        expectedResult = service.addSousServiceToCollectionIfMissing([], null, sousService, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sousService);
      });

      it('should return initial array if no SousService is added', () => {
        const sousServiceCollection: ISousService[] = [sampleWithRequiredData];
        expectedResult = service.addSousServiceToCollectionIfMissing(sousServiceCollection, undefined, null);
        expect(expectedResult).toEqual(sousServiceCollection);
      });
    });

    describe('compareSousService', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSousService(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSousService(entity1, entity2);
        const compareResult2 = service.compareSousService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSousService(entity1, entity2);
        const compareResult2 = service.compareSousService(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSousService(entity1, entity2);
        const compareResult2 = service.compareSousService(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
