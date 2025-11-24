import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UsuarioForm } from './components/usuario-form/usuario-form';
import { UsuarioQuery } from "./components/usuario-query/usuario-query";

@Component({
  selector: 'app-usuarios',
  imports: [MatTabsModule, UsuarioForm, UsuarioQuery],
  templateUrl: './usuarios.html'
})
export class Usuarios {

}
