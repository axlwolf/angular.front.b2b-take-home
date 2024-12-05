import { Component, inject } from '@angular/core';
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
  readonly loginUseCase = inject(LoginUseCase);

  readonly username = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
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
    const passwordField: any = document.getElementById('password');
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  login(): void {
    console.log({ form: this.form });
    if (this.form.valid) {
      this.loginUseCase
        .execute({
          username: this.username.value,
          password: this.password.value,
        })
        .subscribe({
          next: () => {},
          error: (err) => {
            this.errorMessage = err.message; // Mostrar mensaje de error del backend
          },
        });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}
