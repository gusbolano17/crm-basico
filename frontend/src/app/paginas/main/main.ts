import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Toolbar } from '../../layout/toolbar/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [Sidebar, Toolbar, RouterOutlet],
  templateUrl: './main.html',
})
export class Main implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public theme = inject(ThemeService);
  public moduleTitle = signal<string>('');

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let current = this.route;
          while (current.firstChild) {
            current = current.firstChild;
          }
          return current.snapshot.data['title'];
        })
      )
      .subscribe((title) => {
        this.moduleTitle.set(title ?? '');
      });
  }
}
