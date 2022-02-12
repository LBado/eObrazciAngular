import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface Izpit {
  id: number;
  naziv: string;
  datumOprIzpita: string;
  ocena: number;
}

export interface Naslov {
  id: number;
  ulica: string;
  hisnaStevilka: string;
  postnaStevilka: number;
  kraj: string;
  drzava: string;
}

export interface Student {
  id: number;
  ime: string;
  priimek: string;
  spol: string;
  datumRojstva: string;
  naslov: Naslov;
  izpit: Izpit[];
}

export interface Obrazec {
  id: number;
  student: Student;
}

@Injectable({
  providedIn: 'root',
})
export class ObrazciApiService {
  readonly apiUrl = 'https://localhost:7192/api';

  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  getObrazciList(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl + '/obrazci').pipe(
      map((obrazciList: any[]) => {
        return obrazciList;
      })
    );
  }

  addObrazec(obrazec: any) {
    return this.http
      .post(this.apiUrl + '/obrazci', obrazec, {
        responseType: 'text',
      })
      .pipe(catchError(this.errorHandler));
  }

  updateObrazec(obrazecId: number, obrazec: any) {
    return this.http
      .put(this.apiUrl + `/obrazci/${obrazecId}`, obrazec, {
        responseType: 'text',
      })
      .pipe(catchError(this.errorHandler));
  }

  deleteObrazec(obrazecId: number) {
    return this.http
      .delete(this.apiUrl + `/obrazci/${obrazecId}`, {
        responseType: 'text',
      })
      .pipe(catchError(this.errorHandler));
  }
}
