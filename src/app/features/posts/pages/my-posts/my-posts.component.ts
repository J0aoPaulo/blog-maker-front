import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { AuthService } from '../../../../core/services/auth.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent, EmptyStateComponent, ConfirmDialogComponent],
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit, OnDestroy {
  myPosts: PostResponse[] = [];
  loading = false;
  showDeleteDialog = false;
  postToDelete: PostResponse | null = null;
  private readonly subscriptions = new Subscription();

  private readonly postService = inject(PostService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.loadMyPosts();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadMyPosts() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.error('Você precisa estar logado para ver seus posts');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    const sub = this.postService.filter(currentUser.id).subscribe({
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

    this.subscriptions.add(sub);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderImage();
  }

  getPlaceholderImage(): string {
    return 'assets/male-placeholder.png';
  }

  confirmDeletePost(post: PostResponse) {
    this.postToDelete = post;
    this.showDeleteDialog = true;
  }

  onDeleteConfirmed() {
    if (!this.postToDelete) return;

    const sub = this.postService.delete(this.postToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Post excluído com sucesso');
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

    this.subscriptions.add(sub);
  }

  onDeleteCancelled() {
    this.postToDelete = null;
    this.showDeleteDialog = false;
  }
}
