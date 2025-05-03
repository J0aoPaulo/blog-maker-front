import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'blog-maker-front';
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Pré-carrega a imagem do logo apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      const preloadLogo = new Image();
      preloadLogo.src = 'assets/logo-blog-maker.png';
    }
  }
}
