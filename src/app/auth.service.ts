import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly apiUrl = 'https://localhost:7192/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post(
        this.apiUrl + '/users/login',
        {
          username: username,
          password: password,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  register(username: string, password: string) {
    return this.http
      .post(
        this.apiUrl + '/users/register',
        {
          username: username,
          password: password,
        },
        {
          responseType: 'text',
        }
      )
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
