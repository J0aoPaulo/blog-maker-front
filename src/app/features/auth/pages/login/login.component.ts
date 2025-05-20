import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  passwordVisible = false;
  loginAttempts = 0;
  passwordError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.passwordError = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loginAttempts = 0;
        this.toastService.success('Login realizado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 401) {
          this.loginAttempts++;
          this.passwordError = true;

          setTimeout(() => {
            const passwordField = document.getElementById('password');
            if (passwordField) passwordField.focus();
          }, 100);

          if (this.loginAttempts >= 3) {
            this.toastService.error('Várias tentativas incorretas. Verifique sua senha com cuidado ou use a opção "Esqueci minha senha".');
          } else {
            this.toastService.error('Senha incorreta. Por favor, verifique e tente novamente.');
          }

          this.loginForm.get('password')?.setErrors({ incorrect: true });
        } else if (error.status === 404) {
          this.toastService.error('E-mail não cadastrado. Verifique ou crie uma nova conta.');
          this.loginForm.get('email')?.setErrors({ notFound: true });
        } else if (error.status === 0) {
          this.toastService.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
        } else {
          this.toastService.error(error.message || 'Erro ao realizar login. Tente novamente mais tarde.');
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;

    setTimeout(() => {
      const passwordField = document.getElementById('password');
      if (passwordField) passwordField.focus();
    }, 100);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field?.touched || !field?.errors) return '';

    if (field.hasError('required')) return 'Campo obrigatório';
    if (field.hasError('email')) return 'Email inválido';
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    if (field.hasError('incorrect')) return 'Senha incorreta';
    if (field.hasError('notFound')) return 'Email não encontrado';

    return 'Campo inválido';
  }
}
