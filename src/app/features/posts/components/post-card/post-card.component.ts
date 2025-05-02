import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { PostResponse }     from '../../../../core/models/post-reponse.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent {
  @Input() post!: PostResponse;

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
}
