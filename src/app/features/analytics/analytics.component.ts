import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AuthorPostCountDTO, SummaryDTO, ThemePostCountDTO } from '../../core/services/analytics.service';
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

  summary: SummaryDTO | null = null;
  authorData: AuthorPostCountDTO[] = [];
  themeData: ThemePostCountDTO[] = [];

  authorChart: Chart | null = null;
  themeChart: Chart | null = null;

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
    this.subscriptions.unsubscribe();
  }

  loadAllData(): void {
    this.loadingData = true;
    this.hasError = false;
    this.errorMessage = '';

    this.loadSummaryData();
    this.loadAuthorsData();
    this.loadThemeData();
  }

  private loadSummaryData(): void {
    const summarySubscription = this.analyticsService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => {
        console.error('Erro ao carregar resumo:', error);
        this.handleDataLoadError('Não foi possível carregar os dados do resumo');
      }
    });
    this.subscriptions.add(summarySubscription);
  }

  private loadAuthorsData(): void {
    const authorsSubscription = this.analyticsService.getPostsByAuthor().subscribe({
      next: (data) => {
        this.authorData = data;
        this.loadingData = false;
        setTimeout(() => this.renderAuthorChart(), 0);
      },
      error: (error) => {
        console.error('Erro ao carregar dados de autores:', error);
        this.handleDataLoadError('Não foi possível carregar os dados de autores');
      }
    });
    this.subscriptions.add(authorsSubscription);
  }

  private loadThemeData(): void {
    const themesSubscription = this.analyticsService.getPostsByTheme().subscribe({
      next: (data) => {
        this.themeData = data;
        this.loadingData = false;
        setTimeout(() => this.renderThemeChart(), 0);
      },
      error: (error) => {
        console.error('Erro ao carregar dados de temas:', error);
        this.handleDataLoadError('Não foi possível carregar os dados de temas');
      }
    });
    this.subscriptions.add(themesSubscription);
  }

  private handleDataLoadError(message: string): void {
    this.loadingData = false;
    this.hasError = true;
    this.errorMessage = message;
  }

  private renderAuthorChart(): void {
    if (!this.authorChartCanvas || this.authorData.length === 0) return;

    const ctx = this.authorChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.authorChart) {
      this.authorChart.destroy();
    }

    const colors = this.generateColorPalette(this.authorData.length, 0.8);

    this.authorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.authorData.map(item => item.authorName),
        datasets: [{
          label: 'Posts por Autor',
          data: this.authorData.map(item => item.totalPosts),
          backgroundColor: colors
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
            text: 'Distribuição de Posts por Autor',
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

  private renderThemeChart(): void {
    if (!this.themeChartCanvas || this.themeData.length === 0) return;

    const ctx = this.themeChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.themeChart) {
      this.themeChart.destroy();
    }

    const colors = this.generateColorPalette(this.themeData.length, 0.7);

    this.themeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.themeData.map(item => item.themeDescription),
        datasets: [{
          label: 'Posts por Tema',
          data: this.themeData.map(item => item.totalPosts),
          backgroundColor: colors,
          borderWidth: 1,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              }
            }
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

  private generateColorPalette(count: number, opacity: number): string[] {
    const baseColors = [
      `rgba(54, 162, 235, ${opacity})`,
      `rgba(255, 99, 132, ${opacity})`,
      `rgba(255, 205, 86, ${opacity})`,
      `rgba(75, 192, 192, ${opacity})`,
      `rgba(153, 102, 255, ${opacity})`,
      `rgba(255, 159, 64, ${opacity})`,
      `rgba(201, 203, 207, ${opacity})`,
      `rgba(99, 255, 132, ${opacity})`,
      `rgba(46, 204, 113, ${opacity})`,
      `rgba(155, 89, 182, ${opacity})`
    ];

    // Se houver mais itens do que cores, repetir as cores
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  }
}
