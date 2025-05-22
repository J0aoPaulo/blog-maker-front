import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  angularPosts: PostResponse[] = [];
  springPosts: PostResponse[] = [];
  reactPosts: PostResponse[] = [];
  gitPosts: PostResponse[] = [];
  outrosPosts: PostResponse[] = [];
  recentPosts: PostResponse[] = [];
  private readonly subscriptions = new Subscription();

  private readonly postService = inject(PostService);

  ngOnInit() {
    this.carregarPostsPorTema();
    this.carregarPostsRecentes();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getPlaceholderImage();
  }

  getPlaceholderImage(): string {
    return 'assets/male-placeholder.png';
  }

  private carregarPostsPorTema() {
    const sub = this.postService.getAll().subscribe({
      next: (posts) => {
        const sortByDate = (posts: PostResponse[]) => {
          return [...posts].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        };

        this.angularPosts = sortByDate(
          posts.filter(p => p.theme?.toLowerCase().includes('angular'))
        ).slice(0, 3);

        this.springPosts = sortByDate(
          posts.filter(p => p.theme?.toLowerCase().includes('spring'))
        ).slice(0, 3);

        this.reactPosts = sortByDate(
          posts.filter(p => p.theme?.toLowerCase().includes('react'))
        ).slice(0, 3);

        this.gitPosts = sortByDate(
          posts.filter(p => p.theme?.toLowerCase().includes('git'))
        ).slice(0, 3);

        this.outrosPosts = sortByDate(
          posts.filter(p => {
            const theme = p.theme?.toLowerCase() ?? '';
            return !theme.includes('angular') &&
                   !theme.includes('spring') &&
                   !theme.includes('react') &&
                   !theme.includes('git');
          })
        ).slice(0, 3);
      },
      error: (erro) => {
        console.error('Erro ao carregar posts:', erro);
      }
    });

    this.subscriptions.add(sub);
  }

  private carregarPostsRecentes() {
    const sub = this.postService.getAll().subscribe({
      next: (posts) => {
        const sortedPosts = [...posts].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.recentPosts = sortedPosts.slice(0, 3);
      },
      error: (erro) => {
        console.error('Erro ao carregar posts recentes:', erro);
      }
    });

    this.subscriptions.add(sub);
  }
}
