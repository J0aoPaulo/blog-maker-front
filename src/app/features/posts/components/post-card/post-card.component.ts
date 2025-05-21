import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { PostService } from '../../../../core/services/post.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post!: PostResponse;
  isAuthor = false;
  showDeleteDialog = false;

  private readonly svc = inject(PostService)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly toastService = inject(ToastService)

  ngOnInit() {
    this.checkIfUserIsAuthor()
  }

  private checkIfUserIsAuthor(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser && this.post.userId === currentUser.email) {
      this.isAuthor = true
    } else {
      this.isAuthor = false
    }
  }

  get previewContent(): string {
    return this.post.content.length > 200
      ? this.post.content.slice(0, 200) + '…'
      : this.post.content;
  }

  confirmDeletePost() {
    this.showDeleteDialog = true;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderImage();
  }

  getPlaceholderImage(): string {
    return 'assets/male-placeholder.png';
  }

  onDeleteConfirmed() {
    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para excluir este post');
      return;
    }

    this.svc.delete(this.post.id).subscribe({
      next: () => {
        this.toastService.success('Post excluído com sucesso');
        // recarrega rota atual
        this.router.navigateByUrl('/posts', { skipLocationChange: true })
          .then(() => this.router.navigate(['/posts']));
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
