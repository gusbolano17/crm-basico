import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LayoutService } from '../../services/layout';
import { RouterLink } from "@angular/router";
import { ThemeService } from '../../services/theme';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink
],
  templateUrl: './sidebar.html'
})
export class Sidebar {

  public layout = inject(LayoutService);
  public theme = inject(ThemeService);

  items = signal<MenuItem[]>([
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'clientes', icon: 'person', label: 'Clientes' },
    { path: 'productos', icon: 'inventory', label: 'Productos' },
    { path: 'ventas', icon: 'point_of_sale', label: 'Ventas' },
    { path: 'reportes', icon: 'pie_chart', label: 'Reportes' },
    { path: 'usuarios', icon: 'group', label: 'Usuarios' },
  ]);

}
