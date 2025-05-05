import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UpdateUserRequest, UserResponse } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  profileForm: FormGroup;

  loading = false;
  updateLoading = false;

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      photo: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.toastService.error('Usuário não autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      photo: this.user.photo || ''
    });

    this.loading = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile(): void {
    if (!this.user?.email) {
      this.toastService.error('Usuário não encontrado');
      return;
    }

    if (!this.selectedFile && !this.previewUrl) {
      this.toastService.info('Nenhuma alteração realizada');
      return;
    }

    this.updateLoading = true;

    const updateData: UpdateUserRequest = {
      name: this.user.name,
      email: this.user.email
    };

    if (this.selectedFile || this.previewUrl) {
      updateData.photo = this.previewUrl as string;
    }

    this.authService.updateUserProfile(this.user.email, updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.selectedFile = null;
        this.toastService.success('Foto de perfil atualizada com sucesso!');
      },
      error: (error) => {
        this.toastService.error(error.message || 'Erro ao atualizar perfil');
      },
      complete: () => {
        this.updateLoading = false;
      }
    });
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);

    if (!field?.touched || !field?.errors) return '';

    if (field.hasError('required')) return 'Campo obrigatório';
    if (field.hasError('email')) return 'Email inválido';
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }

    return 'Campo inválido';
  }
}
