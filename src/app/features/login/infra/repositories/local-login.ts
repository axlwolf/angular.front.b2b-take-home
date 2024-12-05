import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Credentials } from '../../domain/entities/credentials';
import { LoginRepository } from '../../domain/repositories/login.repository';

@Injectable({
  providedIn: 'root',
})
export class LocalLogin implements LoginRepository {
  readonly #token = 'Cyph3Rt0k3n';

  authenticate(credentials: Credentials): Observable<string | never> {
    if (credentials.username === 'axlwolf@gmail.com') {
      return of(this.#token);
    }

    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
        })
    );
  }
}
