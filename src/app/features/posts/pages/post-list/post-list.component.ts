import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
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
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private themeService = inject(ThemeService);

  // Posts and filtering
  allPosts: PostResponse[] = [];
  filteredPosts$ = new BehaviorSubject<PostResponse[]>([]);
  themes: Theme[] = [];
  isLoading = true;

  // Filter options
  sortOptions = [
    { value: 'newest', label: 'Mais recentes primeiro' },
    { value: 'oldest', label: 'Mais antigos primeiro' },
    { value: 'title', label: 'Título (A-Z)' },
  ];

  // Selected filters
  selectedThemeId: number | null = null;
  selectedSort = 'newest';
  searchTerm = '';

  ngOnInit(): void {
    this.loadPosts();
    this.loadThemes();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getAll().subscribe({
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
  }

  loadThemes(): void {
    this.themeService.getAll().subscribe({
      next: (themes) => {
        this.themes = themes;
      },
      error: (err) => {
        console.error('Error loading themes:', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allPosts];

    // Filter by theme if selected
    if (this.selectedThemeId !== null) {
      filtered = filtered.filter(post => post.themeId === this.selectedThemeId);
    }

    // Filter by search term
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (this.selectedSort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
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
