import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError, timeout } from 'rxjs';
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
    return this.http.get<SummaryDTO>(`${this.apiUrl}/summary`)
      .pipe(
        timeout(10000), // 10 second timeout
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsByAuthor(): Observable<AuthorPostCountDTO[]> {
    return this.http.get<AuthorPostCountDTO[]>(`${this.apiUrl}/posts-by-author`)
      .pipe(
        timeout(10000), // 10 second timeout
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsByTheme(): Observable<ThemePostCountDTO[]> {
    return this.http.get<ThemePostCountDTO[]>(`${this.apiUrl}/posts-by-theme`)
      .pipe(
        timeout(10000), // 10 second timeout
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsOverTime(
    start: string,
    end: string,
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Observable<TimeBucketDTO[]> {
    // Adicionar logs para debug
    console.log(`API Analytics - Requisitando posts de ${start} até ${end} com granularidade ${granularity}`);

    // Properly build HttpParams object instead of using template string
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('granularity', granularity);

    // Use params object instead of inline parameters
    return this.http.get<TimeBucketDTO[]>(
      `${this.apiUrl}/posts-over-time`,
      { params }
    ).pipe(
      timeout(15000), // 15 second timeout for this complex query
      retry(2),
      catchError((error) => {
        console.error('Erro na API de analytics (posts-over-time):', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: any) {
    let errorMessage = 'Erro desconhecido ao acessar API de analytics';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }

    console.error('Analytics API error:', errorMessage, error);
    return throwError(() => error);
  }
}
