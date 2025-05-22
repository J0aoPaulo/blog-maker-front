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

  timeGranularity: 'day' | 'week' | 'month' = 'day';
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
    console.log('Carregando dados temporais:', {
      startDate: this.startDate,
      endDate: this.endDate,
      granularity: this.timeGranularity
    });

    this.timeData = [];

    const timeSubscription = this.analyticsService.getPostsOverTime(
      this.startDate,
      this.endDate,
      this.timeGranularity
    ).subscribe({
      next: (data) => {
        console.log('Dados temporais recebidos:', data);
        this.timeData = data;
        if (data.length === 0) {
          console.warn('Nenhum dado temporal recebido');
        } else {
          setTimeout(() => this.renderTimeChart(), 0);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados temporais:', error);
        this.handleTimeChartError('Não foi possível carregar dados temporais', error);
      }
    });
    this.subscriptions.add(timeSubscription);
  }

  updateTimeChart(): void {
    this.loadTimeSeriesData();
  }

  generateSampleTimeData(): void {
    this.timeData = [];

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Datas inválidas para gerar dados de exemplo');
      return;
    }

    console.log('Gerando dados de exemplo para o período:', {
      start: this.startDate,
      end: this.endDate,
      granularity: this.timeGranularity
    });

    const sampleData: TimeBucketDTO[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const randomPosts = Math.floor(Math.random() * 5) + 1;

      let bucket: string;

      if (this.timeGranularity === 'day') {
        bucket = currentDate.toISOString().split('T')[0];
        currentDate.setDate(currentDate.getDate() + 1);
      }
      else if (this.timeGranularity === 'week') {
        const year = currentDate.getFullYear();
        const weekNumber = this.getWeekNumber(currentDate);
        bucket = `${year}-${weekNumber < 10 ? '0' + weekNumber : weekNumber}-01`;
        currentDate.setDate(currentDate.getDate() + 7);
      }
      else {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        bucket = `${year}-${month < 10 ? '0' + month : month}-01`;
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      sampleData.push({
        bucket,
        totalPosts: randomPosts
      });
    }

    console.log('Dados de exemplo gerados:', sampleData);

    this.timeData = sampleData;
    setTimeout(() => this.renderTimeChart(), 0);
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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
    if (!this.timeChartCanvas || this.timeData.length === 0) {
      console.warn('Não é possível renderizar o gráfico temporal:', {
        canvasExists: !!this.timeChartCanvas,
        dataLength: this.timeData.length
      });
      return;
    }

    const ctx = this.timeChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.timeChart) {
      this.timeChart.destroy();
    }

    console.log('Dados para o gráfico temporal:', this.timeData);

    try {
      const labels = this.timeData.map(item => this.formatBucket(item.bucket));
      const data = this.timeData.map(item => item.totalPosts);

      console.log('Labels formatados:', labels);
      console.log('Dados formatados:', data);

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
    } catch (error) {
      console.error('Erro ao renderizar gráfico temporal:', error);
    }
  }

  private formatBucket(bucket: string): string {
    if (!bucket) {
      console.warn('Bucket inválido:', bucket);
      return 'Desconhecido';
    }

    try {
      const parts = bucket.split('-');

      if (parts.length < 3) {
        console.warn('Formato de bucket inválido:', bucket);
        return bucket;
      }

      if (this.timeGranularity === 'day') {
        return `${parts[2]}/${parts[1]}`;
      } else if (this.timeGranularity === 'week') {
        return `Sem ${parts[1]}`;
      } else {
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;
        const monthIndex = parseInt(parts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${monthNames[monthIndex]}/${parts[0]}`;
        } else {
          console.warn('Índice de mês inválido:', monthIndex, 'de bucket:', bucket);
          return `${parts[1]}/${parts[0]}`;
        }
      }
    } catch (error) {
      console.error('Erro ao formatar bucket:', error);
      return bucket;
    }
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
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

  private handleTimeChartError(message: string, error: any): void {
    console.error(message, error);
    this.timeData = [];
  }
}
