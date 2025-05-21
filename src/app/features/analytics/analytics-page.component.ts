import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, AnalyticsComponent],
  template: `
    <div class="max-w-6xl mx-auto px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
      <app-analytics></app-analytics>
    </div>
  `,
  styles: []
})
export class AnalyticsPageComponent {}