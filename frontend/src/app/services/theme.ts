import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    this.isDarkMode.set(dark);
    this.updateHtmlClass(dark);
  }

  toggleTheme() {
    const dark = !this.isDarkMode();
    this.isDarkMode.set(dark);
    this.updateHtmlClass(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  private updateHtmlClass(dark: boolean) {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle('dark', dark);
  }
}