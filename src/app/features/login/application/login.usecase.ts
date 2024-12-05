import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { ROUTE_CONFIG } from '../../../core/infra/config/routes.config';
import { Credentials } from '../domain/entities/credentials';
import { LoginRepository } from '../domain/repositories/login.repository';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  readonly #router = inject(Router);
  readonly #repository = inject(LoginRepository);

  execute(credentials: Credentials): Observable<string> {
    try {
      console.log({ credentials });
      if (!credentials.username) {
        throw new Error('El correo electrónico es requerido');
      }

      if (!credentials.password) {
        throw new Error('La contraseña es requerida');
      }

      return this.#repository.authenticate(credentials).pipe(
        tap((token) => {
          console.log({ token });
          this.#router.navigate([ROUTE_CONFIG.app, ROUTE_CONFIG.home]);
        }),

        take(1)
      );
    } catch (error) {
      console.warn(error);

      throw error;
    }
  }
}
