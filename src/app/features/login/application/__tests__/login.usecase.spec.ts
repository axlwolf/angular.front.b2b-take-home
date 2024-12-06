import { TestBed } from '@angular/core/testing';
import { LoginUseCase } from '../login.usecase';
import { LoginRepository } from '../../domain/repositories/login.repository';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Credentials } from '../../domain/entities/credentials';
import { ROUTE_CONFIG } from '../../../../core/infra/config/routes.config';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let repository: jasmine.SpyObj<LoginRepository>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('LoginRepository', [
      'authenticate',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        LoginUseCase,
        { provide: LoginRepository, useValue: repositorySpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    useCase = TestBed.inject(LoginUseCase);
    repository = TestBed.inject(
      LoginRepository
    ) as jasmine.SpyObj<LoginRepository>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should authenticate and navigate on success', (done) => {
    const credentials: Credentials = {
      username: 'test@example.com',
      password: 'password123',
    };
    repository.authenticate.and.returnValue(of('token'));

    useCase.execute(credentials).subscribe({
      next: () => {
        expect(router.navigate).toHaveBeenCalledWith([
          ROUTE_CONFIG.app,
          ROUTE_CONFIG.home,
        ]);
        done();
      },
      error: () => {
        fail('Expected valid credentials to succeed');
        done();
      },
    });
  });

  it('should handle error during authentication', (done) => {
    const credentials: Credentials = {
      username: 'test@example.com',
      password: 'wrongpassword',
    };
    repository.authenticate.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    useCase.execute(credentials).subscribe({
      next: () => {
        fail('Expected invalid credentials to throw an error');
        done();
      },
      error: (error) => {
        expect(error.message).toBe('Error en autenticación: Unauthorized');
        done();
      },
    });
  });

  it('should return error if username is empty', (done) => {
    const credentials: Credentials = { username: '', password: 'password123' };

    useCase.execute(credentials).subscribe({
      next: () => {
        fail('Expected empty username to throw an error');
        done();
      },
      error: (error) => {
        expect(error.message).toBe('El correo electrónico es requerido');
        done();
      },
    });
  });

  it('should return error if password is empty', (done) => {
    const credentials: Credentials = {
      username: 'test@example.com',
      password: '',
    };

    useCase.execute(credentials).subscribe({
      next: () => {
        fail('Expected empty password to throw an error');
        done();
      },
      error: (error) => {
        expect(error.message).toBe('La contraseña es requerida');
        done();
      },
    });
  });
});
