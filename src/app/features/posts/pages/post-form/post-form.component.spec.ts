import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

import { PostFormComponent } from './post-form.component';
import { PostService } from '../../../../core/services/post.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Theme } from '../../../../core/models/theme.model';

@Component({
  selector: 'app-post-form',
  template: '',
  standalone: true,
  providers: [
    { provide: PostFormComponent, useExisting: TestPostFormComponent }
  ]
})
class TestPostFormComponent extends PostFormComponent {}

describe('PostFormComponent', () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<TestPostFormComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockThemes: Theme[] = [
    { id: 1, description: 'Tech' },
    { id: 2, description: 'Dev' }
  ];

  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    photo: null
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test content for the post',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Test User',
    userId: 'user1',
    userRole: 'USER',
    theme: 'Tech',
    themeId: 1,
    userPhoto: undefined
  };

  beforeEach(async () => {
    const postService  = jasmine.createSpyObj('PostService', ['getById', 'create', 'update']);
    const themeService = jasmine.createSpyObj('ThemeService', ['getAll']);
    const authService  = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const toastService = jasmine.createSpyObj('ToastService', ['success', 'error']);
    const router       = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TestPostFormComponent
      ],
      declarations: [],
      providers: [
        { provide: PostService,  useValue: postService  },
        { provide: ThemeService, useValue: themeService },
        { provide: AuthService,  useValue: authService  },
        { provide: ToastService, useValue: toastService },
        { provide: Router,       useValue: router       },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture          = TestBed.createComponent(TestPostFormComponent);
    component        = fixture.componentInstance;
    postServiceSpy   = TestBed.inject(PostService)  as jasmine.SpyObj<PostService>;
    themeServiceSpy  = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    authServiceSpy   = TestBed.inject(AuthService)  as jasmine.SpyObj<AuthService>;
    toastServiceSpy  = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    routerSpy        = TestBed.inject(Router)       as jasmine.SpyObj<Router>;

    themeServiceSpy.getAll.and.returnValue(of(mockThemes));
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
  });

  it('deve inicializar o componente no modo de criação', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeFalse();
    expect(themeServiceSpy.getAll).toHaveBeenCalled();
  });

  it('deve carregar temas corretamente', () => {
    fixture.detectChanges();
    expect(component.themes).toEqual(mockThemes);
    expect(component.isLoadingThemes).toBeFalse();
    expect(component.errorLoadingThemes).toBeFalse();
  });

  it('deve exibir erro quando falhar ao carregar temas', () => {
    themeServiceSpy.getAll.and.returnValue(throwError(() => new Error('Erro ao carregar temas')));
    fixture.detectChanges();
    expect(component.errorLoadingThemes).toBeTrue();
    expect(component.isLoadingThemes).toBeFalse();
  });

  it('deve validar campos obrigatórios do formulário', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();

    component.form.patchValue({
      title: 'Título do post',
      content: 'Conteúdo do post com pelo menos 20 caracteres'
    });

    expect(component.form.valid).toBeTrue();
  });

  it('deve redirecionar para login quando usuário não está autenticado', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    expect(toastServiceSpy.error)
      .toHaveBeenCalledWith('Você precisa estar logado para criar um post');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve criar um post com sucesso', () => {
    fixture.detectChanges();
    postServiceSpy.create.and.returnValue(of(mockPost));

    component.form.patchValue({
      title: 'Novo Post',
      content: 'Conteúdo do novo post com mais de 20 caracteres',
      themeId: 1
    });

    component.save();

    expect(postServiceSpy.create).toHaveBeenCalled();
    expect(toastServiceSpy.success).toHaveBeenCalledWith('Post criado com sucesso!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
