import { Component, inject, input, signal } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatDivider } from '@angular/material/divider';
import { LayoutService } from '../../services/layout';
import { ThemeService } from '../../services/theme';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
import { SnackbarService } from '../../services/snackbar-service';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbar, MatIcon, MatMenu, MatDivider, MatMenuTrigger, RouterLink],
  templateUrl: './toolbar.html'
})
export class Toolbar {

  private loginService = inject(AuthService);
  private snackbarService = inject(SnackbarService);

  public layout = inject(LayoutService);
  public theme = inject(ThemeService);

  public moduleTitle = input<string>('');

  logout(){
    this.loginService.logout().subscribe({
      next: () => {
        this.snackbarService.open('La sesion ha finalizado correctamente');
      },
      error: () => {
        this.snackbarService.open('Error al finalizar la sesion');
      }
    });
  }

}
