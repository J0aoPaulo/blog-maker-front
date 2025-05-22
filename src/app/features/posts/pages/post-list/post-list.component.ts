import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PostService } from '../../../../core/services/post.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { Theme } from '../../../../core/models/theme.model';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly themeService = inject(ThemeService);
  private readonly subscriptions = new Subscription();

  allPosts: PostResponse[] = [];
  filteredPosts$ = new BehaviorSubject<PostResponse[]>([]);
  themes: Theme[] = [];
  isLoading = true;

  readonly sortOptions = [
    { value: 'newest', label: 'Mais recentes primeiro' },
    { value: 'oldest', label: 'Mais antigos primeiro' },
    { value: 'title', label: 'Título (A-Z)' },
  ];

  selectedThemeId: number | null = null;
  selectedSort = 'newest';
  searchTerm = '';

  ngOnInit(): void {
    this.loadPosts();
    this.loadThemes();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadPosts(): void {
    this.isLoading = true;
    const sub = this.postService.getAll().subscribe({
      next: (posts) => {
        this.allPosts = posts;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
      }
    });

    this.subscriptions.add(sub);
  }

  loadThemes(): void {
    const sub = this.themeService.getAll().subscribe({
      next: (themes) => {
        this.themes = themes;
      },
      error: (err) => {
        console.error('Error loading themes:', err);
      }
    });

    this.subscriptions.add(sub);
  }

  applyFilters(): void {
    let filtered = [...this.allPosts];

    if (this.selectedThemeId !== null) {
      filtered = filtered.filter(post => post.themeId === this.selectedThemeId);
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
      );
    }

    switch (this.selectedSort) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    this.filteredPosts$.next(filtered);
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onThemeChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedThemeId = null;
    this.selectedSort = 'newest';
    this.searchTerm = '';
    this.applyFilters();
  }
}
