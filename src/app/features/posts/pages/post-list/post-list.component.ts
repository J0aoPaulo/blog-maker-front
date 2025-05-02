import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Observable }        from 'rxjs';
import { PostService }       from '../../../../core/services/post.service';
import { PostResponse }      from '../../../../core/models/post-reponse.model';
import { Router } from 'express';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  private postService = inject(PostService);
  posts$ = this.postService.getAll() as Observable<PostResponse[]>;
}
