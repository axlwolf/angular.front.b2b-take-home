import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AplazoButtonComponent } from '@apz/shared-ui/button';
import { AplazoLogoComponent } from '@apz/shared-ui/logo';
import { LoginUseCase } from '../../../application/login.usecase';
import {
  AplazoNoWhiteSpaceDirective,
  AplazoLowercaseDirective,
} from '@apz/shared-ui';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    AplazoButtonComponent,
    AplazoLogoComponent,
    CommonModule,
    AplazoNoWhiteSpaceDirective,
    AplazoLowercaseDirective,
  ],
})
export class LoginComponent {
  @ViewChild('passwordField') passwordField!: ElementRef<HTMLInputElement>;

  readonly loginUseCase = inject(LoginUseCase);

  readonly username = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    ],
  });

  readonly password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly form = new FormGroup({
    username: this.username,
    password: this.password,
  });

  showPassword: boolean = false;
  errorMessage: string | null = null;

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword
      ? 'text'
      : 'password';
  }

  handleLoginError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.errorMessage =
        error.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'Error al iniciar sesión. Intente nuevamente.';
    } else {
      this.errorMessage = error.message;
    }
  }

  login(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const loginCredentials = {
      username: this.username.value.toLowerCase(),
      password: this.password.value,
    };

    this.loginUseCase.execute(loginCredentials).subscribe({
      next: () => {
        // Acción después de un login exitoso, si aplica
        console.log('Login exitoso');
      },
      error: (error) => this.handleLoginError(error),
    });
  }
}
