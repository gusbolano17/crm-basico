import { Component, inject} from '@angular/core';
import { ThemeService } from './services/theme';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App{
    
  public theme = inject(ThemeService);

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  }

}
