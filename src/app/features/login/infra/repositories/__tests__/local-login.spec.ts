import { TestBed } from '@angular/core/testing';
import { LocalLogin } from '../local-login';
import { HttpErrorResponse } from '@angular/common/http';
import { Credentials } from '../../../domain/entities/credentials';

describe('LocalLogin', () => {
  let service: LocalLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalLogin],
    });
    service = TestBed.inject(LocalLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a token for valid credentials', (done) => {
    const credentials: Credentials = {
      username: 'axlwolf@gmail.com',
      password: 'password',
    };

    service.authenticate(credentials).subscribe({
      next: (token) => {
        expect(token).toBe('Cyph3Rt0k3n');
        done();
      },
      error: () => {
        fail('Expected valid credentials to return a token');
      },
    });
  });

  it('should throw an error for invalid credentials', (done) => {
    const credentials: Credentials = {
      username: 'invalid@example.com',
      password: 'password',
    };

    service.authenticate(credentials).subscribe({
      next: () => {
        fail('Expected invalid credentials to throw an error');
      },
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(401);
        expect(error.statusText).toBe('Unauthorized');
        done();
      },
    });
  });
});
