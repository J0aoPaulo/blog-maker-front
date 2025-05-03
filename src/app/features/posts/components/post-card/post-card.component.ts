import { Component, inject, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { PostResponse }     from '../../../../core/models/post-reponse.model';
import { PostService } from '../../../../core/services/post.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent {
  @Input() post!: PostResponse;

  private svc = inject(PostService)
  private router = inject(Router)

  get previewContent(): string {
    return this.post.content.length > 200
      ? this.post.content.slice(0, 200) + '…'
      : this.post.content;
  }

  placeholderUrl = 'https://via.placeholder.com/40?text=?';

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = this.placeholderUrl;
  }

  get initial() {
    return this.post.name?.charAt(0).toUpperCase() ?? '';
  }

  deletePost() {
    if (confirm('Excluir este post?')) {
      this.svc.delete(this.post.id!).subscribe(() => {
        // recarrega rota atual
        this.router.navigateByUrl('/posts', { skipLocationChange: true })
          .then(() => this.router.navigate(['/posts']));
      });
}
    function inject(PostService: any) {
      throw new Error('Function not implemented.');
    }
  }
}
