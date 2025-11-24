import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Component, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';

interface StatCard {
  title: string;
  value: string | number;
  diff?: string;
  icon?: string; 
}

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, MatCardModule, MatIcon, NgClass],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  
  cards = signal<StatCard[]>([
    { title: 'Usuarios activos', value: 12432, diff: '+4.2%', icon: 'people' },
    { title: 'Ventas hoy', value: '$3,240', diff: '+1.1%', icon: 'attach_money' },
    { title: 'Nuevos leads', value: 92, diff: '-2.5%', icon: 'insights' },
    { title: 'Tasa de conversión', value: '3.8%', diff: '+0.3%', icon: 'trending_up' }
  ]);


}
