import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
      error: (error: HttpErrorResponse | any) => {
        this.loading = false;

        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status;
          const message = error.message || 'Erro desconhecido';

          if (status === 401 || (message && message.toLowerCase().includes('credenciais'))) {
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
          } else if (status === 404) {
            this.toastService.error('E-mail não cadastrado. Verifique ou crie uma nova conta.');
            this.loginForm.get('email')?.setErrors({ notFound: true });
          } else if (status === 0) {
            this.toastService.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
          } else {
            this.toastService.error(message || 'Erro ao realizar login. Verifique suas credenciais e tente novamente.');
          }
        } else {
          console.error('Erro de formato inesperado:', error);
          this.toastService.error('Erro ao realizar login, verifique suas credenciais e tente novamente.');
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
