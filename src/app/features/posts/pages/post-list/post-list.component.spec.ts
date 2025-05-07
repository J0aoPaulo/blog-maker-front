import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { PostListComponent } from './post-list.component';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/response/post-reponse.model';
import { AuthService } from '../../../../core/services/auth.service';

import { Component } from '@angular/core';
@Component({ selector: 'app-post-card', standalone: true, template: '' })
class PostCardStub {}

class PostServiceMock {
  constructor(private posts: PostResponse[]) {
    this.getAll = jasmine.createSpy('getAll').and.returnValue(of(this.posts));
  }
  getAll: jasmine.Spy;
}

class AuthServiceMock {
  isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(true);
  getCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue({
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    photo: null
  });
}

describe('PostListComponent', () => {
  function configureTest(posts: PostResponse[]) {
    TestBed.configureTestingModule({
      imports: [PostListComponent, PostCardStub],
      providers: [
        { provide: PostService, useValue: new PostServiceMock(posts) },
        { provide: AuthService, useClass: AuthServiceMock },
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(PostListComponent);
    fixture.detectChanges();
    return fixture;
  }

  const mockPosts: PostResponse[] = [
    {
      id: 1,
      title: 'Angular Rocks',
      content: 'c',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Alice',
      userId: 'id',
      userRole: 'USER',
      theme: 'Tech',
      themeId: 1,
      userPhoto: undefined
    },
    {
      id: 2,
      title: 'RxJS Tips',
      content: 'd',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Bob',
      userId: 'id2',
      userRole: 'USER',
      theme: 'Dev',
      themeId: 2,
      userPhoto: undefined
    }
  ];

  it('deve renderizar lista quando há posts', async () => {
    const fixture = configureTest(mockPosts);
    const cards = fixture.debugElement.queryAll(By.css('app-post-card'));
    expect(cards.length).toBe(2);
  });

  it('deve exibir estado vazio quando não há posts', async () => {
    const fixture = configureTest([]);
    const empty = fixture.debugElement.nativeElement.textContent;
    expect(empty).toContain('Nenhum post encontrado');
  });
});
