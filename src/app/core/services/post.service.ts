import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { environment }          from '../../../environments/environment';
import { CreatePostRequest }    from '../models/request/create-post-request.model';
import { UpdatePostRequest }    from '../models/request/update-post-request.model';
import { PostResponse }         from '../models/response/post-reponse.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly baseUrl = `${environment.api}/posts`;
  private debugMode = true; // Habilitando o modo de debug para testar diferentes formatos

  constructor(private http: HttpClient) {}

  create(request: CreatePostRequest, themeId?: number) {
    let params = new HttpParams();
    if (themeId != null) params = params.set('themeId', themeId.toString());

    console.log(`Enviando requisição para: ${this.baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    console.log('Corpo da requisição:', JSON.stringify(request));

    return this.http.post<PostResponse>(this.baseUrl, request, { params }).pipe(
      map(post => this.addGenderToPost(post))
    );
  }

  getById(id: number): Observable<PostResponse> {
    return this.http.get<PostResponse>(`${this.baseUrl}/${id}`).pipe(
      map(post => this.addGenderToPost(post))
    );
  }

  getAll(): Observable<PostResponse[]> {
    return this.http.get<PostResponse[]>(this.baseUrl).pipe(
      map(posts => posts.map(post => this.addGenderToPost(post)))
    );
  }

  filter(userId?: string, themeId?: number): Observable<PostResponse[]> {
    let params = new HttpParams();
    if (userId)   { params = params.set('userId', userId); }
    if (themeId)  { params = params.set('themeId', themeId.toString()); }

    console.log(`Enviando requisição de filtragem para: ${this.baseUrl}/filter${params.toString() ? '?' + params.toString() : ''}`);

    return this.http.get<PostResponse[]>(`${this.baseUrl}/filter`, { params }).pipe(
      map(posts => posts.map(post => this.addGenderToPost(post)))
    );
  }

  update(id: number, request: UpdatePostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(`${this.baseUrl}/${id}`, request).pipe(
      map(post => this.addGenderToPost(post))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Adiciona a propriedade de gênero ao post baseado no nome do usuário
   * Essa é uma solução temporária até que o backend forneça essa informação
   */
  private addGenderToPost(post: PostResponse): PostResponse {
    if (post.userGender === undefined) {
      // Lista de nomes femininos comuns em português
      const femaleNames = [
        'maria', 'ana', 'juliana', 'fernanda', 'mariana', 'patricia', 'patricia',
        'camila', 'julia', 'beatriz', 'larissa', 'bruna', 'jessica', 'leticia',
        'isabela', 'gabriela', 'amanda', 'natalia', 'vanessa', 'priscila',
        'carolina', 'carla', 'daniela', 'aline', 'tatiana', 'monica', 'raquel',
        'vitoria', 'bianca', 'renata', 'claudia', 'jaqueline'
      ];

      // Obtém o primeiro nome do autor
      const firstName = post.name?.split(' ')[0]?.toLowerCase() || '';

      // Verifica se o nome está na lista de nomes femininos
      post.userGender = femaleNames.includes(firstName) ? 'feminino' : 'masculino';
    }

    return post;
  }
}
