import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../core/services/post.service';
import { PostResponse } from '../../../../core/models/post-reponse.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  post?: PostResponse;
  private route = inject(ActivatedRoute);
  private svc   = inject(PostService);
  private router = inject(Router);

  placeholderUrl = 'https://via.placeholder.com/48?text=?';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe(p => this.post = p);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholderUrl;
  }

  editPost() {
    if (this.post) {
      this.router.navigate(['/posts', this.post.id, 'edit']);
    }
  }

  deletePost() {
    if (this.post && confirm('Tem certeza que deseja excluir este post?')) {
      this.svc.delete(this.post.id).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (err) => {
          console.error('Erro ao excluir post:', err);
          alert('Não foi possível excluir o post. Tente novamente mais tarde.');
        }
      });
    }
  }
}
