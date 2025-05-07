import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  post?: PostResponse;
  isAuthor = false;

  private route = inject(ActivatedRoute);
  private svc = inject(PostService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  placeholderUrl = 'https://via.placeholder.com/48?text=?';

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

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholderUrl;
  }

  editPost() {
    if (!this.post) return;

    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para editar este post');
      return;
    }

    this.router.navigate(['/posts', this.post.id, 'edit']);
  }

  deletePost() {
    if (!this.post) return;

    if (!this.isAuthor) {
      this.toastService.error('Você não tem permissão para excluir este post');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este post?')) {
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
  }
}
