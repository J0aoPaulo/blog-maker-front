import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SummaryDTO {
  totalPosts: number;
  totalAuthors: number;
  totalThemes: number;
}

export interface AuthorPostCountDTO {
  userId: string;
  authorName: string;
  totalPosts: number;
}

export interface ThemePostCountDTO {
  themeId: number;
  themeDescription: string;
  totalPosts: number;
}

export interface TimeBucketDTO {
  bucket: string;
  totalPosts: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.api}/analytics`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<SummaryDTO> {
    return this.http.get<SummaryDTO>(`${this.apiUrl}/summary`);
  }

  getPostsByAuthor(): Observable<AuthorPostCountDTO[]> {
    return this.http.get<AuthorPostCountDTO[]>(`${this.apiUrl}/posts-by-author`);
  }

  getPostsByTheme(): Observable<ThemePostCountDTO[]> {
    return this.http.get<ThemePostCountDTO[]>(`${this.apiUrl}/posts-by-theme`);
  }

  getPostsOverTime(
    start: string,
    end: string,
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Observable<TimeBucketDTO[]> {
    return this.http.get<TimeBucketDTO[]>(
      `${this.apiUrl}/posts-over-time`,
      { params: { start, end, granularity } }
    );
  }
}
