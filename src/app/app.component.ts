import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'blog-maker-front';

  ngOnInit() {
    // Pré-carrega a imagem do logo para garantir que ela estará no cache do navegador
    const preloadLogo = new Image();
    preloadLogo.src = 'assets/logo-blog-maker.png';
  }
}
