import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  post?: PostResponse;
  isAuthor = false;
  showDeleteDialog = false;

  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(PostService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.checkIfUserIsAuthor();
      },
      error: (err) => {
        console.error('Erro ao carregar post:', err);
        if (err.status === 403) {
          this.toastService.error('Você não tem permissão para visualizar este post');
          this.router.navigate(['/']);
        } else {
          this.toastService.error('Erro ao carregar post');
        }
      }
    });
  }

  private checkIfUserIsAuthor(): void {
    if (!this.post) return;

    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.post.userId === currentUser.email) {
      this.isAuthor = true;
    } else {
      this.isAuthor = false;
    }
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderImage();
  }

  getPlaceholderImage(): string {
    return 'assets/male-placeholder.png';
  }

  editPost() {
    if (!this.post) return;

    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para editar este post');
      return;
    }

    this.router.navigate(['/posts', this.post.id, 'edit']);
  }

  confirmDeletePost() {
    if (!this.post) return;

    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para excluir este post');
      return;
    }

    this.showDeleteDialog = true;
  }

  onDeleteConfirmed() {
    if (!this.post) return;

    this.svc.delete(this.post.id).subscribe({
      next: () => {
        this.toastService.success('Post excluído com sucesso');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao excluir post:', err);
        this.toastService.error('Não foi possível excluir o post. Tente novamente mais tarde.');
      }
    });
  }

  onDeleteCancelled() {
    this.showDeleteDialog = false;
  }
}
