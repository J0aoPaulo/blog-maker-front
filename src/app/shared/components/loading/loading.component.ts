import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [ngClass]="{'full-page': fullPage}">
      <div class="loading-spinner">
        <div class="animate-spin rounded-full border-t-4 border-indigo-600 h-12 w-12 border-opacity-75"></div>
      </div>
      <p *ngIf="message" class="mt-4 text-gray-700 text-sm font-medium">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .full-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 9999;
    }
  `]
})
export class LoadingComponent {
  @Input() fullPage = false;
  @Input() message?: string;
}
