import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AuthorPostCountDTO, SummaryDTO, ThemePostCountDTO, TimeBucketDTO } from '../../core/services/analytics.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild('authorChartCanvas') authorChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('themeChartCanvas') themeChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeChartCanvas') timeChartCanvas!: ElementRef<HTMLCanvasElement>;

  summary: SummaryDTO | null = null;
  authorData: AuthorPostCountDTO[] = [];
  themeData: ThemePostCountDTO[] = [];
  timeData: TimeBucketDTO[] = [];

  authorChart: Chart | null = null;
  themeChart: Chart | null = null;
  timeChart: Chart | null = null;

  timeGranularity: 'day' | 'week' | 'month' = 'week';
  startDate: string = this.getDefaultStartDate();
  endDate: string = this.getDefaultEndDate();

  loadingData = false;
  hasError = false;
  errorMessage = '';

  private readonly subscriptions = new Subscription();
  private readonly analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    if (this.authorChart) {
      this.authorChart.destroy();
    }
    if (this.themeChart) {
      this.themeChart.destroy();
    }
    if (this.timeChart) {
      this.timeChart.destroy();
    }
    this.subscriptions.unsubscribe();
  }

  loadAllData(): void {
    this.loadingData = true;
    this.hasError = false;

    const summarySubscription = this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        this.handleError('Não foi possível carregar o resumo', error);
      }
    });
    this.subscriptions.add(summarySubscription);

    const authorSubscription = this.analyticsService.getPostsByAuthor().subscribe({
      next: (data) => {
        this.authorData = data;
        setTimeout(() => this.renderAuthorChart(), 0);
      },
      error: (error) => {
        this.handleError('Não foi possível carregar dados por autor', error);
      }
    });
    this.subscriptions.add(authorSubscription);

    const themeSubscription = this.analyticsService.getPostsByTheme().subscribe({
      next: (data) => {
        this.themeData = data;
        setTimeout(() => this.renderThemeChart(), 0);
      },
      error: (error) => {
        this.handleError('Não foi possível carregar dados por tema', error);
      }
    });
    this.subscriptions.add(themeSubscription);

    this.loadTimeSeriesData();

    this.loadingData = false;
  }

  loadTimeSeriesData(): void {
    const timeSubscription = this.analyticsService.getPostsOverTime(
      this.startDate,
      this.endDate,
      this.timeGranularity
    ).subscribe({
      next: (data) => {
        this.timeData = data;
        setTimeout(() => this.renderTimeChart(), 0);
      },
      error: (error) => {
        this.handleError('Não foi possível carregar dados temporais', error);
      }
    });
    this.subscriptions.add(timeSubscription);
  }

  updateTimeChart(): void {
    this.loadTimeSeriesData();
  }

  private renderAuthorChart(): void {
    if (!this.authorChartCanvas || this.authorData.length === 0) return;

    const ctx = this.authorChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.authorChart) {
      this.authorChart.destroy();
    }

    const sorted = [...this.authorData].sort((a, b) => b.totalPosts - a.totalPosts);

    const N = 8;
    let displayItems: { authorName: string; totalPosts: number }[];
    if (sorted.length > N) {
      const top = sorted.slice(0, N);
      const othersTotal = sorted.slice(N).reduce((sum, item) => sum + item.totalPosts, 0);
      displayItems = [
        ...top,
        { authorName: 'Outros', totalPosts: othersTotal }
      ];
    } else {
      displayItems = sorted;
    }

    const labels = displayItems.map(item => item.authorName);
    const data   = displayItems.map(item => item.totalPosts);

    this.authorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Posts por Autor',
          data,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Número de Posts por Autor',
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  private renderThemeChart(): void {
    if (!this.themeChartCanvas || this.themeData.length === 0) return;

    const ctx = this.themeChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.themeChart) {
      this.themeChart.destroy();
    }

    const labels = this.themeData.map(item => item.themeDescription);
    const data = this.themeData.map(item => item.totalPosts);

    this.themeChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(52, 211, 153, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(251, 191, 36, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          },
          title: {
            display: true,
            text: 'Distribuição de Posts por Tema',
            font: {
              size: 16
            }
          }
        }
      }
    });
  }

  private renderTimeChart(): void {
    if (!this.timeChartCanvas || this.timeData.length === 0) return;

    const ctx = this.timeChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.timeChart) {
      this.timeChart.destroy();
    }

    const labels = this.timeData.map(item => this.formatBucket(item.bucket));
    const data = this.timeData.map(item => item.totalPosts);

    this.timeChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Posts',
          data: data,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Distribuição de Posts ao Longo do Tempo',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  private formatBucket(bucket: string): string {
    const parts = bucket.split('-');

    if (this.timeGranularity === 'day') {
      return `${parts[2]}/${parts[1]}`;
    } else if (this.timeGranularity === 'week') {
      return `Sem ${parts[1]}`;
    } else {
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;
      return `${monthNames[parseInt(parts[1], 10) - 1]}/${parts[0]}`;
    }
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  }

  private getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private handleError(message: string, error: any): void {
    this.hasError = true;
    this.errorMessage = message;
    this.loadingData = false;
    console.error(message, error);
  }
}
