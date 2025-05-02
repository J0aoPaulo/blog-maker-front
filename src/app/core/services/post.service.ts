import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment }          from '../../../environments/environment';
import { CreatePostRequest }    from '../models/create-post-request.model';
import { UpdatePostRequest }    from '../models/update-post-request.model';
import { PostResponse }         from '../models/post-reponse.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly baseUrl = `${environment.api}/posts`;

  constructor(private http: HttpClient) {}

  create(request: CreatePostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.baseUrl, request);
  }

  getById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.baseUrl);
  }

  filter(userId?: string, themeId?: number): Observable<PostResponse[]> {
    let params = new HttpParams();
    if (userId)   { params = params.set('userId', userId); }
    if (themeId)  { params = params.set('themeId', themeId.toString()); }
    return this.http.get<PostResponse[]>(`${this.baseUrl}/filter`, { params });
  }

  update(id: number, request: UpdatePostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
