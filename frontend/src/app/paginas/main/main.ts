import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Toolbar } from '../../layout/toolbar/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [Sidebar, Toolbar, RouterOutlet],
  templateUrl: './main.html',
})
export class Main {

  public theme = inject(ThemeService);

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  }

}
