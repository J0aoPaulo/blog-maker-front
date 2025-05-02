import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../core/services/post.service';
import { CreatePostRequest } from '../../../../core/models/create-post-request.model';
import { UpdatePostRequest } from '../../../../core/models/update-post-request.model';
import { HttpErrorResponse } from '@angular/common/http';

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
  private svc    = inject(PostService);

  isEdit = false;
  postId?: number;

  form = this.fb.group({
    title:   ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    themeId: [null as number | null],
    userId:  [null as string | null]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.postId = +id;
      this.svc.getById(this.postId).subscribe(p =>
        this.form.patchValue({
          title:   p.title,
          content: p.content,
          themeId: p.themeId,
          userId:  p.userId
        })
      );
    } else {
      this.form.patchValue({
        userId: 'd2e57245-7063-4d6e-94d5-2480f44cdba2'
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    if (this.isEdit) {
      const dtoUpdate: UpdatePostRequest = {
        title:   raw.title!,
        content: raw.content!,
        ...(raw.themeId != null ? { themeId: raw.themeId } : {}),
      };

      this.svc.update(this.postId!, dtoUpdate)
        .subscribe({
          next: () => this.router.navigate(['/posts']),
          error: err => console.error('Erro ao atualizar', err)
        });

    } else {
      const dtoCreate: CreatePostRequest = {
        title:   raw.title!,
        content: raw.content!,
        userId:  raw.userId!,                  
        ...(raw.themeId != null ? { themeId: raw.themeId } : {}),
      };

      this.svc.create(dtoCreate)
        .subscribe({
          next: () => this.router.navigate(['/posts']),
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao criar', err.error);
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
}
