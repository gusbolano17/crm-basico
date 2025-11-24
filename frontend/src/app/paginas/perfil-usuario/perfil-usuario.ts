import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PerfilUsuarioService } from '../../services/perfil-usuario-service';
import { PerfilUsuarioEntity } from '../../modelos/perfil-usuario';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioForm } from '../usuarios/components/usuario-form/usuario-form';

@Component({
  selector: 'app-perfil-usuario',
  imports: [MatTabsModule, MatCardModule, MatIcon, MatButtonModule, MatChip, CdkAccordionModule],
  templateUrl: './perfil-usuario.html',
})
export class PerfilUsuario implements OnInit {
  private perfilUsuarioService = inject(PerfilUsuarioService);
  private dialog = inject(MatDialog);

  public perfilUsuario = signal<PerfilUsuarioEntity>(new PerfilUsuarioEntity());

  ngOnInit(): void {
    this.perfilUsuarioService.obtenerPerfilUsuario().subscribe((data) => {
      this.perfilUsuario.set(data);
      console.log('pu', this.perfilUsuario());
    });
  }

  editarPerfilUsuario(){
    this.dialog.open(UsuarioForm, {
      width: '80vw',
      data: {
        perfil : this.perfilUsuario(),
        mode : 'profile'
      }
    });
  }
}
