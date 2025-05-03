import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theme } from '../models/theme.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly baseUrl = `${environment.api}/themes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Theme[]> {
    return this.http.get<Theme[]>(this.baseUrl);
  }

  getById(id: number): Observable<Theme> {
    return this.http.get<Theme>(`${this.baseUrl}/${id}`);
  }
}
