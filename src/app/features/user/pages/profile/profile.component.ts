import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { Router } from '@angular/router';
import { UserResponse } from '../../../../core/models/response/user-response.model';
import { UpdateUserRequest } from '../../../../core/models/response/update-user-request.model';

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
    private readonly authService: AuthService,
    private readonly fb: FormBuilder,
    private readonly toastService: ToastService,
    private readonly router: Router
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
      photo: this.user.photo ?? ''
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
      email: this.user.email,
      password: '',
      photo: ''
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
        this.toastService.error(error.message ?? 'Erro ao atualizar perfil');
      },
      complete: () => {
        this.updateLoading = false;
      }
    });
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderImagePath();
  }

  getPlaceholderImagePath(): string {
    return 'assets/male-placeholder.png';
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
