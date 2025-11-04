import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ClientesForm } from "./components/clientes-form/clientes-form";
import { ClientesQuery } from "./components/clientes-query/clientes-query";

@Component({
  selector: 'app-clientes',
  imports: [MatTabsModule, MatCardModule, ClientesForm, ClientesQuery],
  templateUrl: './clientes-main.html',
  standalone: true
})
export class ClientesMain {

}
