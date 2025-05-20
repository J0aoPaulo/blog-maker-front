import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../core/services/post.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { Theme } from '../../../../core/models/theme.model';
import { CreatePostRequest } from '../../../../core/models/request/create-post-request.model';
import { UpdatePostRequest } from '../../../../core/models/request/update-post-request.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './post-form.component.html'
})
export class PostFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  isEdit = false;
  postId?: number;
  themes: Theme[] = [];
  isLoadingThemes = true;
  errorLoadingThemes = false;

  form = this.fb.group({
    title:   ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    themeId: [null as number | null]
  });

  ngOnInit() {
    this.loadThemes();
    this.setupForm();
  }

  private loadThemes() {
    this.isLoadingThemes = true;
    this.errorLoadingThemes = false;

    this.themeService.getAll().subscribe({
      next: (themes) => {
        this.themes = themes;
        this.isLoadingThemes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar temas:', err);
        this.errorLoadingThemes = true;
        this.isLoadingThemes = false;
      }
    });
  }

  private setupForm() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.postId = +id;
      this.postService.getById(this.postId).subscribe({
        next: (post) => {
          const currentUser = this.authService.getCurrentUser();
          if (!currentUser || post.userId !== currentUser.id) {
            this.toastService.error('Você não tem permissão para editar este post');
            this.router.navigate(['/posts', this.postId]);
            return;
          }

          this.form.patchValue({
            title:   post.title,
            content: post.content,
            themeId: post.themeId
          });
        },
        error: (err) => {
          console.error('Erro ao carregar post para edição:', err);
          this.toastService.error('Erro ao carregar post para edição');
          this.router.navigate(['/']);
        }
      });
    } else {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.toastService.error('Você precisa estar logado para criar um post');
        this.router.navigate(['/login']);
        return;
      }
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastService.error('Você precisa estar logado para gerenciar posts');
      this.router.navigate(['/login']);
      return;
    }

    const raw = this.form.value;

    if (this.isEdit) {
      this.postService.getById(this.postId!).subscribe({
        next: (post) => {
          if (post.userId !== currentUser.id) {
            this.toastService.error('Você não tem permissão para editar este post');
            this.router.navigate(['/posts', this.postId]);
            return;
          }

          const dtoUpdate: UpdatePostRequest = {
            title:   raw.title!,
            content: raw.content!,
            ...(raw.themeId != null ? { themeId: +raw.themeId } : {}),
          };

          this.postService.update(this.postId!, dtoUpdate)
            .subscribe({
              next: () => {
                this.toastService.success('Post atualizado com sucesso!');
                this.router.navigate(['/posts', this.postId]);
              },
              error: err => {
                console.error('Erro ao atualizar', err);
                this.toastService.error('Erro ao atualizar o post');
              }
            });
        },
        error: (err) => {
          console.error('Erro ao verificar permissões:', err);
          this.toastService.error('Erro ao verificar permissões');
        }
      });
    } else {
      if (!currentUser) {
        this.toastService.error('Você precisa estar logado para criar um post');
        this.router.navigate(['/login']);
        return;
      }

      console.log('Usuário atual para criação:', currentUser);

      const dtoCreate: CreatePostRequest = {
        title: raw.title!,
        content: raw.content!,
        themeId: raw.themeId ? +raw.themeId : undefined
      }

      console.log('Enviando request de criação:', dtoCreate);

      this.postService.create(dtoCreate, dtoCreate.themeId)
        .subscribe({
          next: (response) => {
            console.log('Post criado com sucesso:', response);
            this.toastService.success('Post criado com sucesso!');
            this.router.navigate(['/']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao criar post:', err);

            if (err.error) {
              console.error('Detalhes do erro:', JSON.stringify(err.error));
            }

            if (err.status === 409 || (err.error?.message && err.error.message.includes('duplicado'))) {
              this.toastService.error('Já existe um post com conteúdo similar. Por favor, modifique o conteúdo para evitar duplicação.');
            } else if (err.status === 400) {
              if (err.error?.message?.includes('título')) {
                this.toastService.error('Título inválido. Verifique e tente novamente.');
              } else if (err.error?.message?.includes('conteúdo')) {
                this.toastService.error('Conteúdo inválido. Verifique e tente novamente.');
              } else {
                this.toastService.error('Dados inválidos. Verifique os campos e tente novamente.');
              }
            } else if (err.status === 403) {
              this.toastService.error('Você não tem permissão para criar posts.');
            } else if (err.status === 0) {
              this.toastService.error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
            } else {
              this.toastService.error(`Erro ao criar o post: ${err.status === 500 ? 'Erro interno no servidor' : err.error?.message || 'Erro desconhecido'}`);
            }

            if (err.error?.errors) {
              for (const [field, msg] of Object.entries(err.error.errors)) {
                const control = this.form.get(field);
                if (control) {
                  control.setErrors({ server: msg as string });
                }
              }
            }
          }
        });
    }
  }

  getThemeName(themeId: number): string {
    const theme = this.themes.find(t => t.id === themeId);
    return theme ? theme.description : 'Sem tema';
  }
}
