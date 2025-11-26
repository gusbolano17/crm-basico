import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Toolbar } from '../../layout/toolbar/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { PerfilUsuarioService } from '../../services/perfil-usuario-service';

@Component({
  selector: 'app-main',
  imports: [Sidebar, Toolbar, RouterOutlet],
  templateUrl: './main.html',
})
export class Main implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly perfilUsuarioService = inject(PerfilUsuarioService);

  public userdata = signal<any>(null);
  public imgUser = signal<string>('');

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

    this.obtenerPerfilUsuario();
  }

  obtenerPerfilUsuario() {
    this.perfilUsuarioService.obtenerPerfilUsuario().subscribe(resp => {
      this.userdata.set(resp);
    })
  }
}
