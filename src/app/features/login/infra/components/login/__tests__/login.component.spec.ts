import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoginComponent } from '../login.component';
import { LoginUseCase } from '../../../../application/login.usecase';
import { of, throwError } from 'rxjs';
import { AplazoButtonComponent } from '@apz/shared-ui/button';
import { AplazoLogoComponent } from '@apz/shared-ui/logo';
import {
  AplazoNoWhiteSpaceDirective,
  AplazoLowercaseDirective,
} from '@apz/shared-ui';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginUseCase: jasmine.SpyObj<LoginUseCase>;

  beforeEach(async () => {
    const loginUseCaseSpy = jasmine.createSpyObj('LoginUseCase', ['execute']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginComponent,
        AplazoButtonComponent,
        AplazoLogoComponent,
        AplazoNoWhiteSpaceDirective,
        AplazoLowercaseDirective,
      ],
      providers: [{ provide: LoginUseCase, useValue: loginUseCaseSpy }],
    }).compileComponents();

    loginUseCase = TestBed.inject(LoginUseCase) as jasmine.SpyObj<LoginUseCase>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email and password fields', () => {
    const email = component.form.controls['username'];
    email.setValue('');
    expect(email.valid).toBeFalse();

    const password = component.form.controls['password'];
    password.setValue('');
    expect(password.valid).toBeFalse();
  });

  it('should toggle showPassword variable', () => {
    component.toggleShowPassword();
    expect(component.showPassword).toBeTrue();
    expect(component.passwordField.nativeElement.type).toBe('text');

    component.toggleShowPassword();
    expect(component.showPassword).toBeFalse();
    expect(component.passwordField.nativeElement.type).toBe('password');
  });

  it('should display error message on invalid form submit', () => {
    component.login();
    expect(component.errorMessage).toBe(
      'Por favor, complete todos los campos correctamente.'
    );
  });

  it('should call loginUseCase.execute with valid credentials', () => {
    const credentials = {
      username: 'test@example.com',
      password: 'password123',
    };
    loginUseCase.execute.and.returnValue(of('token'));

    component.username.setValue(credentials.username);
    component.password.setValue(credentials.password);
    component.login();

    expect(loginUseCase.execute).toHaveBeenCalledWith(credentials);
    expect(component.errorMessage).toBeNull();
  });

  it('should handle authentication error', () => {
    loginUseCase.execute.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    component.username.setValue('test@example.com');
    component.password.setValue('wrongpassword');
    component.login();

    expect(loginUseCase.execute).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Unauthorized');
  });

  it('should sanitize email input using AplazoNoWhiteSpaceDirective', () => {
    const emailInput = fixture.debugElement.query(By.css('#username'));
    emailInput.nativeElement.value = '   test@example.com   ';
    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });

    fixture.detectChanges();
    expect(component.username.value).toBe('test@example.com');
  });

  it('should convert email input to lowercase using AplazoLowercaseDirective', () => {
    const emailInput = fixture.debugElement.query(By.css('#username'));
    emailInput.nativeElement.value = 'TEST@EXAMPLE.COM';
    emailInput.triggerEventHandler('input', {
      target: emailInput.nativeElement,
    });

    fixture.detectChanges();
    expect(component.username.value).toBe('test@example.com');
  });
});
