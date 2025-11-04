import { MatTabsModule } from '@angular/material/tabs';
import { Component, inject } from '@angular/core';
import { ProductosQuery } from "./components/productos-query/productos-query";
import { ProductosForm } from "./components/productos-form/productos-form";



@Component({
  selector: 'app-productos',
  imports: [MatTabsModule, ProductosQuery, ProductosForm],
  templateUrl: './productos.html'
})
export class Productos {

}
