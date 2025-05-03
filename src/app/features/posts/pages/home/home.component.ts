import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/post-reponse.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  angularPosts: PostResponse[] = [];
  springPosts: PostResponse[] = [];
  reactPosts: PostResponse[] = [];
  recentPosts: PostResponse[] = [];

  private postService = inject(PostService);

  ngOnInit() {
    this.carregarPostsPorTema();
    this.carregarPostsRecentes();
  }

  private carregarPostsPorTema() {
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.angularPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('angular'))
          .slice(0, 3);

        this.springPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('spring'))
          .slice(0, 3);

        this.reactPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('react'))
          .slice(0, 3);

      },
      error: (erro) => {
        console.error('Erro ao carregar posts:', erro);
      }
    });
  }

  private carregarPostsRecentes() {
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.recentPosts = posts.slice(0, 3);

      },
      error: (erro) => {
        console.error('Erro ao carregar posts recentes:', erro);
      }
    });
  }
}
