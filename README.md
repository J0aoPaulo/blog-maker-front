# Blog Maker Frontend

<p align="center">
  <img src="src/assets/logo-blog-maker.png" alt="Blog Maker Logo" width="250"/>
</p>

<p align="center">
  Uma plataforma moderna de blogging desenvolvida com Angular.
</p>

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso da Aplicação](#uso-da-aplicação)
- [Integração com Backend](#integração-com-backend)
- [Contribuição](#contribuição)

## 🌟 Visão Geral

Blog Maker Frontend é uma aplicação Angular moderna e intuitiva que fornece uma interface de usuário robusta para o sistema de gerenciamento de blog. A aplicação suporta criação, edição e visualização de posts de blog, autenticação de usuários, temas personalizáveis e análise de métricas.

## 🚀 Tecnologias

- **Angular 17**: Framework principal para desenvolvimento de SPA
- **TypeScript**: Linguagem de programação tipada
- **TailwindCSS**: Framework CSS utility-first para estilização
- **RxJS**: Biblioteca para programação reativa
- **Angular Router**: Sistema de navegação entre páginas
- **HttpClient**: Módulo para comunicação com APIs RESTful
- **ESLint/Prettier**: Ferramentas para qualidade de código

## 📁 Estrutura do Projeto

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

### Autenticação
- Login com JWT
- Registro de novos usuários
- Proteção de rotas para usuários autenticados
- Persistência de sessão

### Gerenciamento de Posts
- Visualização de todos os posts na Home
- Listagem de posts do usuário em "Meus Posts"
- Criação de novos posts com editor
- Edição e exclusão de posts próprios
- Filtragem de posts por temas

### Analytics
- Visualização de estatísticas sobre posts
- Gráficos e métricas de engajamento

### Interface de Usuário
- Design responsivo para desktop e mobile
- Navegação intuitiva
- Feedback visual para ações (toasts)
- Componentes reutilizáveis e consistentes

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/blog-maker-front.git
cd blog-maker-front
```

2. Instale as dependências:
```bash
npm install
# ou com yarn
yarn install
```

3. Configure o ambiente:
   
Edite o arquivo `src/environments/environment.ts` para apontar para seu backend:
```typescript
export const environment = {
  production: false,
  api: 'http://localhost:8080/api/v1'
};
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run start
# ou com yarn
yarn start
```

5. Acesse a aplicação em `http://localhost:4200`

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
- Navegue até a seção "Analytics" para visualizar métricas

## 🔌 Integração com Backend

O frontend se comunica com o backend Spring Boot através de chamadas de API REST. A integração é gerenciada pelos serviços no diretório `src/app/core/services`, especialmente:

- `auth.service.ts`: Gerencia autenticação e estado do usuário
- `post.service.ts`: Lida com operações de CRUD para posts
- `theme.service.ts`: Gerencia categorias de posts
- `analytics.service.ts`: Obtém estatísticas e métricas

Todas as requisições HTTP são interceptadas pelo `auth.interceptor.ts` que adiciona o token JWT às requisições autenticadas.

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Fork o repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

<p align="center">
  © 2024 Blog Maker. Desenvolvido como parte do programa Acelera Java.
</p>
