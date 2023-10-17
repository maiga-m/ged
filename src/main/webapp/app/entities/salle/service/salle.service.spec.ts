import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISalle } from '../salle.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../salle.test-samples';

import { SalleService } from './salle.service';

const requireRestSample: ISalle = {
  ...sampleWithRequiredData,
};

describe('Salle Service', () => {
  let service: SalleService;
  let httpMock: HttpTestingController;
  let expectedResult: ISalle | ISalle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SalleService);
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

    it('should create a Salle', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const salle = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(salle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Salle', () => {
      const salle = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(salle).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Salle', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Salle', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Salle', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSalleToCollectionIfMissing', () => {
      it('should add a Salle to an empty array', () => {
        const salle: ISalle = sampleWithRequiredData;
        expectedResult = service.addSalleToCollectionIfMissing([], salle);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salle);
      });

      it('should not add a Salle to an array that contains it', () => {
        const salle: ISalle = sampleWithRequiredData;
        const salleCollection: ISalle[] = [
          {
            ...salle,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSalleToCollectionIfMissing(salleCollection, salle);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Salle to an array that doesn't contain it", () => {
        const salle: ISalle = sampleWithRequiredData;
        const salleCollection: ISalle[] = [sampleWithPartialData];
        expectedResult = service.addSalleToCollectionIfMissing(salleCollection, salle);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salle);
      });

      it('should add only unique Salle to an array', () => {
        const salleArray: ISalle[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const salleCollection: ISalle[] = [sampleWithRequiredData];
        expectedResult = service.addSalleToCollectionIfMissing(salleCollection, ...salleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const salle: ISalle = sampleWithRequiredData;
        const salle2: ISalle = sampleWithPartialData;
        expectedResult = service.addSalleToCollectionIfMissing([], salle, salle2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(salle);
        expect(expectedResult).toContain(salle2);
      });

      it('should accept null and undefined values', () => {
        const salle: ISalle = sampleWithRequiredData;
        expectedResult = service.addSalleToCollectionIfMissing([], null, salle, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(salle);
      });

      it('should return initial array if no Salle is added', () => {
        const salleCollection: ISalle[] = [sampleWithRequiredData];
        expectedResult = service.addSalleToCollectionIfMissing(salleCollection, undefined, null);
        expect(expectedResult).toEqual(salleCollection);
      });
    });

    describe('compareSalle', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSalle(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSalle(entity1, entity2);
        const compareResult2 = service.compareSalle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSalle(entity1, entity2);
        const compareResult2 = service.compareSalle(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSalle(entity1, entity2);
        const compareResult2 = service.compareSalle(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
