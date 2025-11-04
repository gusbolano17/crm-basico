import { Component, inject, signal } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatDivider } from '@angular/material/divider';
import { LayoutService } from '../../services/layout';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbar, MatIcon, MatMenu, MatDivider, MatMenuTrigger],
  templateUrl: './toolbar.html'
})
export class Toolbar {

  public layout = inject(LayoutService);
  public theme = inject(ThemeService);

}
