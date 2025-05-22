import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-72 space-y-2">
      <div
        *ngFor="let toast of toasts"
        class="toast-item p-3 rounded-lg shadow-lg flex items-start justify-between transform transition-all duration-300 ease-in-out animate-fade-in"
        [ngClass]="{
          'bg-green-100 text-green-800 border-l-4 border-green-500': toast.type === 'success',
          'bg-red-100 text-red-800 border-l-4 border-red-500': toast.type === 'error',
          'bg-blue-100 text-blue-800 border-l-4 border-blue-500': toast.type === 'info',
          'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500': toast.type === 'warning'
        }"
      >
        <div class="flex-grow pr-3">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        <button
          (click)="removeToast(toast.id)"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private readonly toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}
