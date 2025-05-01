import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Observable }        from 'rxjs';
import { PostService }       from '../../../../core/services/post.service';
import { PostResponse }      from '../../../../core/models/post-reponse.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  private postService = inject(PostService);
  posts$ = this.postService.getAll() as Observable<PostResponse[]>;
}
