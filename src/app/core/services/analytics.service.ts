import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError, timeout, tap } from 'rxjs';
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
        timeout(10000),
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsByAuthor(): Observable<AuthorPostCountDTO[]> {
    return this.http.get<AuthorPostCountDTO[]>(`${this.apiUrl}/posts-by-author`)
      .pipe(
        timeout(10000),
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsByTheme(): Observable<ThemePostCountDTO[]> {
    return this.http.get<ThemePostCountDTO[]>(`${this.apiUrl}/posts-by-theme`)
      .pipe(
        timeout(10000),
        retry(3),
        catchError(this.handleError)
      );
  }

  getPostsOverTime(
    start: string,
    end: string,
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Observable<TimeBucketDTO[]> {
    const formattedStart = this.formatDateIfNeeded(start);
    const formattedEnd = this.formatDateIfNeeded(end);

    console.log('Enviando requisição de dados temporais:', {
      startDate: formattedStart,
      endDate: formattedEnd,
      granularity
    });

    const params = new HttpParams()
      .set('start', formattedStart)
      .set('end', formattedEnd)
      .set('granularity', granularity);

    const url = `${this.apiUrl}/posts-over-time`;
    console.log('URL da requisição:', url, 'com params:', params.toString());

    return this.http.get<TimeBucketDTO[]>(url, { params })
      .pipe(
        tap(data => console.log('Resposta da API de dados temporais:', data)),
        timeout(15000),
        retry(2),
        catchError((error) => {
          console.error('Erro na API de dados temporais:', error);
          return this.handleError(error);
        })
      );
  }

  private formatDateIfNeeded(dateStr: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return dateStr;
    }
  }

  private handleError(error: any) {
    let errorMessage = 'Erro desconhecido ao acessar API de analytics';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }

    console.error('Analytics API error:', errorMessage, error);
    return throwError(() => error);
  }
}
