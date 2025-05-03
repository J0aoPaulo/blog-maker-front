import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/post-reponse.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  angularPosts: PostResponse[] = [];
  springPosts: PostResponse[] = [];
  reactPosts: PostResponse[] = [];
  recentPosts: PostResponse[] = [];

  private postService = inject(PostService);

  ngOnInit() {
    this.carregarPostsPorTema();
    this.carregarPostsRecentes();
  }

  private carregarPostsPorTema() {
    this.postService.getAll().subscribe({
      next: (posts) => {
        console.log('Posts carregados:', posts);

        this.angularPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('angular'))
          .slice(0, 3);

        this.springPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('spring'))
          .slice(0, 3);

        this.reactPosts = posts
          .filter(p => p.theme?.toLowerCase().includes('react'))
          .slice(0, 3);

        if (this.angularPosts.length === 0) this.criarAngularPostsExemplo();
        if (this.springPosts.length === 0) this.criarSpringPostsExemplo();
        if (this.reactPosts.length === 0) this.criarReactPostsExemplo();
      },
      error: (erro) => {
        console.error('Erro ao carregar posts:', erro);
        this.criarAngularPostsExemplo();
        this.criarSpringPostsExemplo();
        this.criarReactPostsExemplo();
      }
    });
  }

  private carregarPostsRecentes() {
    this.postService.getAll().subscribe({
      next: (posts) => {
        this.recentPosts = posts.slice(0, 3);

        if (this.recentPosts.length === 0) {
          this.criarPostsRecentesExemplo();
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar posts recentes:', erro);
        this.criarPostsRecentesExemplo();
      }
    });
  }

  private criarAngularPostsExemplo() {
    this.angularPosts = [
      {
        id: 1,
        title: 'Novidades do Angular 17',
        content: 'Descubra as novas funcionalidades do Angular 17, incluindo melhorias de performance e novas APIs.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Angular',
        name: 'João Paulo',
        userId: '1',
        userRole: 'user'
      },
      {
        id: 2,
        title: 'Componentes Dinâmicos no Angular',
        content: 'Aprenda a criar componentes dinâmicos com ViewContainerRef e ComponentFactoryResolver.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Angular',
        name: 'Maria Souza',
        userId: '2',
        userRole: 'user'
      },
      {
        id: 3,
        title: 'Performance no Angular',
        content: 'Dicas para otimizar a performance da sua aplicação Angular com ChangeDetectionStrategy e OnPush.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Angular',
        name: 'Carlos Santos',
        userId: '3',
        userRole: 'user'
      }
    ];
  }

  private criarSpringPostsExemplo() {
    this.springPosts = [
      {
        id: 4,
        title: 'Spring Boot 3.0 Overview',
        content: 'Conheça as principais novidades do Spring Boot 3.0 e como migrar sua aplicação.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Spring Boot',
        name: 'Ana Costa',
        userId: '4',
        userRole: 'user'
      },
      {
        id: 5,
        title: 'API REST com Spring Boot',
        content: 'Crie APIs RESTful completas com Spring Boot e Spring Data JPA.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Spring Boot',
        name: 'Roberto Alves',
        userId: '5',
        userRole: 'user'
      },
      {
        id: 6,
        title: 'Spring Security na prática',
        content: 'Implementação de autenticação e autorização com Spring Security e JWT.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Spring Boot',
        name: 'Fernanda Lima',
        userId: '6',
        userRole: 'user'
      }
    ];
  }

  private criarReactPostsExemplo() {
    this.reactPosts = [
      {
        id: 7,
        title: 'React 18 e Server Components',
        content: 'Explore os novos Server Components e como eles melhoram a performance das aplicações React.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'React',
        name: 'Bruno Dias',
        userId: '7',
        userRole: 'user'
      },
      {
        id: 8,
        title: 'Gerenciamento de Estado com Redux Toolkit',
        content: 'Simplifique o gerenciamento de estado da sua aplicação React com Redux Toolkit.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'React',
        name: 'Carla Mendes',
        userId: '8',
        userRole: 'user'
      },
      {
        id: 9,
        title: 'React Query: Fetching de Dados Simplificado',
        content: 'Aprenda como o React Query torna o fetching, caching e atualização de dados uma tarefa simples.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'React',
        name: 'Daniel Oliveira',
        userId: '9',
        userRole: 'user'
      }
    ];
  }

  private criarPostsRecentesExemplo() {
    this.recentPosts = [
      {
        id: 10,
        title: 'Testando no Angular',
        content: 'Como criar testes eficientes para aplicações Angular.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Testes',
        name: 'Ana Paula',
        userId: '10',
        userRole: 'user'
      },
      {
        id: 11,
        title: 'Performance no Angular',
        content: 'Dicas para otimizar a performance da sua aplicação Angular.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'Performance',
        name: 'Bruno Dias',
        userId: '11',
        userRole: 'user'
      },
      {
        id: 12,
        title: 'Gerenciamento de Estado',
        content: 'Como usar NgRx para gerenciar o estado da sua aplicação.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'State',
        name: 'Fernanda Luz',
        userId: '12',
        userRole: 'user'
      }
    ];
  }
}
