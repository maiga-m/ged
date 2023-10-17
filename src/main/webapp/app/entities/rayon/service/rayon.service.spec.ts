import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRayon } from '../rayon.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../rayon.test-samples';

import { RayonService } from './rayon.service';

const requireRestSample: IRayon = {
  ...sampleWithRequiredData,
};

describe('Rayon Service', () => {
  let service: RayonService;
  let httpMock: HttpTestingController;
  let expectedResult: IRayon | IRayon[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RayonService);
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

    it('should create a Rayon', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rayon = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rayon).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Rayon', () => {
      const rayon = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rayon).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Rayon', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Rayon', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Rayon', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRayonToCollectionIfMissing', () => {
      it('should add a Rayon to an empty array', () => {
        const rayon: IRayon = sampleWithRequiredData;
        expectedResult = service.addRayonToCollectionIfMissing([], rayon);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rayon);
      });

      it('should not add a Rayon to an array that contains it', () => {
        const rayon: IRayon = sampleWithRequiredData;
        const rayonCollection: IRayon[] = [
          {
            ...rayon,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRayonToCollectionIfMissing(rayonCollection, rayon);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Rayon to an array that doesn't contain it", () => {
        const rayon: IRayon = sampleWithRequiredData;
        const rayonCollection: IRayon[] = [sampleWithPartialData];
        expectedResult = service.addRayonToCollectionIfMissing(rayonCollection, rayon);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rayon);
      });

      it('should add only unique Rayon to an array', () => {
        const rayonArray: IRayon[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rayonCollection: IRayon[] = [sampleWithRequiredData];
        expectedResult = service.addRayonToCollectionIfMissing(rayonCollection, ...rayonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rayon: IRayon = sampleWithRequiredData;
        const rayon2: IRayon = sampleWithPartialData;
        expectedResult = service.addRayonToCollectionIfMissing([], rayon, rayon2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rayon);
        expect(expectedResult).toContain(rayon2);
      });

      it('should accept null and undefined values', () => {
        const rayon: IRayon = sampleWithRequiredData;
        expectedResult = service.addRayonToCollectionIfMissing([], null, rayon, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rayon);
      });

      it('should return initial array if no Rayon is added', () => {
        const rayonCollection: IRayon[] = [sampleWithRequiredData];
        expectedResult = service.addRayonToCollectionIfMissing(rayonCollection, undefined, null);
        expect(expectedResult).toEqual(rayonCollection);
      });
    });

    describe('compareRayon', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRayon(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRayon(entity1, entity2);
        const compareResult2 = service.compareRayon(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRayon(entity1, entity2);
        const compareResult2 = service.compareRayon(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRayon(entity1, entity2);
        const compareResult2 = service.compareRayon(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
