import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {
  myPosts: PostResponse[] = [];
  loading = false;
  showDeleteDialog = false;
  postToDelete: PostResponse | null = null;

  private postService = inject(PostService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ngOnInit() {
    this.loadMyPosts();
  }

  private loadMyPosts() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.error('Você precisa estar logado para ver seus posts');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    this.postService.filter(currentUser.id).subscribe({
      next: posts => {
        this.myPosts = posts;
        this.loading = false;
        console.log(`Carregados ${posts.length} posts para o usuário ${currentUser.id}`);
      },
      error: (erro) => {
        console.error('Erro ao carregar posts:', erro);
        this.toastService.error('Erro ao carregar seus posts');
        this.loading = false;
      }
    });
  }

  confirmDeletePost(post: PostResponse) {
    this.postToDelete = post;
    this.showDeleteDialog = true;
  }

  onDeleteConfirmed() {
    if (!this.postToDelete) return;

    this.postService.delete(this.postToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Post excluído com sucesso');
        // Atualizar a lista de posts
        this.myPosts = this.myPosts.filter(p => p.id !== this.postToDelete!.id);
        this.postToDelete = null;
        this.showDeleteDialog = false;
      },
      error: (erro) => {
        console.error('Erro ao excluir post:', erro);
        this.toastService.error('Erro ao excluir o post');
        this.showDeleteDialog = false;
      }
    });
  }

  onDeleteCancelled() {
    this.postToDelete = null;
    this.showDeleteDialog = false;
  }
}
