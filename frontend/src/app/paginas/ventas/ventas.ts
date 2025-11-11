import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { VentasForm } from './components/ventas-form/ventas-form';
import { VentasQuery } from './components/ventas-query/ventas-query';

@Component({
  selector: 'app-ventas',
  imports: [MatTabsModule, VentasForm, VentasQuery],
  templateUrl: './ventas.html'
})
export class Ventas {

}
