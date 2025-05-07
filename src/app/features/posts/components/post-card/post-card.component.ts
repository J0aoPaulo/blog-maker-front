import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { PostResponse }     from '../../../../core/models/response/post-reponse.model';
import { PostService } from '../../../../core/services/post.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post!: PostResponse;
  isAuthor = false;

  private svc = inject(PostService)
  private router = inject(Router)
  private authService = inject(AuthService)
  private toastService = inject(ToastService)

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

  placeholderUrl = 'https://via.placeholder.com/40?text=?';

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholderUrl;
  }

  get initial() {
    return this.post.name?.charAt(0).toUpperCase() ?? '';
  }

  deletePost() {
    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para excluir este post');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este post?')) {
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
  }
}
