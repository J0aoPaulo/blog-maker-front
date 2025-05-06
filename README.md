# Blog Maker Frontend

<p align="center">
  <img src="src/assets/logo-blog-maker.png" alt="Blog Maker Logo" width="250"/>
</p>

<p align="center">
  <b>Uma plataforma moderna de blogging desenvolvida com Angular</b>
</p>

<p align="center">
  <a href="#visão-geral">Visão Geral</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#estrutura-do-projeto">Estrutura</a> •
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#instalação-e-configuração">Instalação</a> •
  <a href="#uso-da-aplicação">Uso</a> •
  <a href="#integração-com-backend">Integração</a> •
  <a href="#deploy-no-railway">Deploy</a> •
  <a href="#relatório-do-projeto">Relatório</a>
</p>

---

## 🌟 Visão Geral

Blog Maker Frontend é uma aplicação Angular moderna e intuitiva que fornece uma interface de usuário robusta para o sistema de gerenciamento de blog. A aplicação suporta criação, edição e visualização de posts de blog, autenticação de usuários, temas personalizáveis e análise de métricas.

Desenvolvida como parte do programa Acelera Java, esta plataforma demonstra a implementação de uma Single Page Application (SPA) completa, seguindo as melhores práticas de desenvolvimento frontend.

## 🚀 Tecnologias

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" />
</p>

- **Angular**: Framework principal para desenvolvimento de SPA
- **TypeScript**: Linguagem de programação tipada para desenvolvimento seguro
- **TailwindCSS**: Framework CSS utility-first para estilização responsiva e moderna
- **RxJS**: Biblioteca para programação reativa e manipulação de eventos assíncronos
- **Angular Router**: Sistema de navegação entre páginas com lazy-loading
- **HttpClient**: Módulo para comunicação com APIs RESTful
- **ESLint/Prettier**: Ferramentas para garantir qualidade e consistência do código

## Algumas telas do projeto (Analytics, Meus Posts e Home)
<div align="center">
    <img src="https://github.com/user-attachments/assets/9bd271f6-0236-4641-83d0-71ba61d6c99d" alt="Analytics" width="30%">
    <img src="https://github.com/user-attachments/assets/4abff606-0f45-414a-9f48-8878a9cebed3" alt="Meus Posts" width="30%">
    <img src="https://github.com/user-attachments/assets/dc3dc3d9-4f74-46de-afd3-0901af6db3b2" alt="Home" width="30%">
</div>

## 📁 Estrutura do Projeto

Uma arquitetura modular e bem organizada, separando claramente as responsabilidades:

```
src/app/
├── core/                    # Funcionalidades centrais da aplicação
│   ├── components/          # Componentes compartilhados essenciais (header)
│   ├── guards/              # Guards para proteção de rotas
│   ├── interceptors/        # Interceptores HTTP (auth)
│   ├── models/              # Interfaces e tipos
│   └── services/            # Serviços de dados (auth, post, etc)
├── features/                # Módulos de funcionalidades
│   ├── analytics/           # Módulo de analytics
│   ├── auth/                # Módulo de autenticação (login, registro)
│   │   └── pages/           # Páginas de autenticação
│   ├── posts/               # Módulo de posts
│   │   └── pages/           # Páginas para gerenciamento de posts
│   └── user/                # Módulo de gerenciamento de usuário
├── shared/                  # Componentes e utilitários compartilhados
│   └── components/          # Componentes reutilizáveis (botões, cards, etc)
└── assets/                  # Recursos estáticos (imagens, ícones)
```

## ✨ Funcionalidades

### 🔐 Autenticação
- **Login com JWT**: Sistema seguro de autenticação
- **Registro de usuários**: Fluxo intuitivo para novos usuários
- **Proteção de rotas**: Guards para controle de acesso
- **Persistência de sessão**: Manutenção do estado de autenticação

### 📝 Gerenciamento de Posts
- **Feed de posts**: Visualização de todos os posts na Home
- **Posts do usuário**: Listagem de posts do usuário em "Meus Posts"
- **Editor de conteúdo**: Criação de novos posts com editor rico
- **CRUD completo**: Edição e exclusão de posts próprios
- **Categorização**: Filtragem de posts por temas

### 📊 Analytics
- **Dashboard**: Visualização de estatísticas sobre posts
- **Métricas de engajamento**: Gráficos e dados de interação
- **Relatórios**: Exportação de dados para análise

### 🎨 Interface de Usuário
- **Design responsivo**: Adaptação perfeita para desktop e mobile
- **Navegação intuitiva**: UX focada na experiência do usuário
- **Feedback visual**: Sistema de notificações e toasts
- **Componentes consistentes**: Design system próprio e reutilizável

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn
- Git

### Passos para Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/blog-maker-front.git
cd blog-maker-front
```

2. **Instale as dependências**:
```bash
npm install
# ou com yarn
yarn install
```

3. **Configure o ambiente**:
   
Edite o arquivo `src/environments/environment.ts` para apontar para seu backend:
```typescript
export const environment = {
  production: false,
  api: 'http://localhost:8080/api/v1'
};
```

4. **Inicie o servidor de desenvolvimento**:
```bash
npm run start
# ou com yarn
yarn start
```

5. **Acesse a aplicação** em `http://localhost:4200`

## 💻 Uso da Aplicação

### Autenticação
1. Acesse a página inicial
2. Clique em "Login" ou "Cadastre-se" para acessar o sistema
3. Forneça suas credenciais ou crie uma nova conta

### Gerenciamento de Posts
- Acesse "Meus Posts" para visualizar seus próprios posts
- Clique em "Novo Post" para criar um novo conteúdo
- Use os botões de edição e exclusão para gerenciar posts existentes

### Analytics
- Navegue até a seção "Analytics" para visualizar métricas e relatórios
- Utilize os filtros para análises específicas

## 🔌 Integração com Backend

O frontend se comunica com o backend Spring Boot através de chamadas de API REST. A integração é gerenciada pelos serviços no diretório `src/app/core/services`:

| Serviço | Responsabilidade |
| ------- | ---------------- |
| `auth.service.ts` | Gerencia autenticação e estado do usuário |
| `post.service.ts` | Lida com operações de CRUD para posts |
| `theme.service.ts` | Gerencia categorias de posts |
| `analytics.service.ts` | Obtém estatísticas e métricas |

Todas as requisições HTTP são interceptadas pelo `auth.interceptor.ts` que adiciona o token JWT às requisições autenticadas.

## 🚂 Deploy no Railway (Em desenvolvimento)

O Blog Maker Frontend está hospedado na plataforma [Railway](https://railway.app/), uma solução moderna e eficiente para deploy de aplicações web.

### Sobre o Railway

Railway é uma plataforma de infraestrutura como serviço (IaaS) que simplifica o processo de deploy, oferecendo:

- **Deploy Automático**: Integração direta com GitHub para CI/CD
- **Previews por Pull Request**: Ambiente de teste para cada PR
- **Domínio Personalizado**: Configuração simples de domínios
- **Scaling Automático**: Ajuste de recursos conforme necessidade
- **Monitoramento**: Logs e métricas em tempo real

### Como acessar

A aplicação está disponível em:
- [https://blog-maker-front-production.up.railway.app/](https://blog-maker-front-production.up.railway.app/)

## 📋 Relatório do Projeto

### 🔍 Desafios Enfrentados

#### 1. Implementação de Autenticação JWT
- **Desafio**: Integração segura com o backend e persistência do token entre sessões
- **Solução**: Desenvolvimento de um interceptor HTTP e um serviço de autenticação robusto, com armazenamento do token no localStorage e verificação de validade

#### 2. Responsividade em Diferentes Dispositivos
- **Desafio**: Garantir uma experiência consistente em desktop, tablet e mobile
- **Solução**: Adoção do TailwindCSS com abordagem mobile-first e uso de media queries estratégicas

#### 3. Gerenciamento de Estado da Aplicação
- **Desafio**: Compartilhamento de dados entre componentes não relacionados
- **Solução**: Implementação de serviços com observables RxJS para gerenciar o estado global

#### 4. Otimização de Performance
- **Desafio**: Carregamento lento em páginas com muitos posts
- **Solução**: Implementação de lazy loading, paginação de dados e virtualização de listas para posts

#### 5. Integração Contínua
- **Desafio**: Garantir qualidade do código em um ambiente de desenvolvimento colaborativo
- **Solução**: Configuração de pipeline CI/CD com testes automatizados e análise de código

### 💡 Lições Aprendidas

1. **Arquitetura Escalável**: A importância de uma estrutura de projeto bem planejada para facilitar a manutenção e evolução
2. **TypeScript em Profundidade**: Utilização de recursos avançados de tipagem para garantir segurança no desenvolvimento
3. **Padrões de Design**: Implementação de padrões como Repository, Observer e Singleton
4. **Testes Automatizados**: Desenvolvimento orientado por testes para garantir robustez
5. **UX/UI**: Princípios fundamentais de design de interfaces para uma experiência de usuário superior

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Fork o repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

<p align="center">
  <img src="src/assets/logo-blog-maker.png" alt="Blog Maker Logo" width="120"/>
</p>

<p align="center">
  © 2025 Blog Maker. Desenvolvido como parte do programa Acelera Maker.
</p>
