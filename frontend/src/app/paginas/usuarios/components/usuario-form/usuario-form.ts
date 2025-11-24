import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PerfilUsuarioService } from '../../../../services/perfil-usuario-service';
import { UsuarioReq, UsuariosService } from '../../../../services/usuarios-service';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../../../../services/file-service';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './usuario-form.html',
})
export class UsuarioForm implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuariosService);
  private perfilUsuario = inject(PerfilUsuarioService);
  private snackBarService = inject(SnackbarService);
  private fileService = inject(FileService);

  public dataDialog = inject(MAT_DIALOG_DATA, { optional: true });
  public usuarioForm!: FormGroup;

  public modeForm = signal<string>('create');
  public previewUrl = signal<string | null>(null);
  public roles = signal<string[]>(['vendedor', 'supervisor', 'usuario']);
  public estadosUsuario = signal<string[]>(['activo', 'inactivo']);

  ngOnInit(): void {
    this.onBuildForm();
    if (this.dataDialog?.mode === 'profile') {
      const perfil = this.dataDialog.perfil;
      this.usuarioForm.patchValue({
        nombre: perfil.usuario.nombre,
        biografia: perfil.biografia,
        telefono: perfil.telefono,
        direccion: perfil.direccion,
        avatarUrl: perfil.avatarUrl,
      });
    }else if (this.dataDialog?.mode === 'edit') {
      const usuario = this.dataDialog.usuario;
      this.usuarioForm.patchValue({
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
        estado: usuario.activo ? 'activo' : 'inactivo',
      });
    }
  }

  onBuildForm() {
    const mode = this.dataDialog?.mode || 'create';

    this.modeForm.set(mode);
    console.log(this.modeForm());
    

    const isCreate = mode === 'create';
    const isProfile = mode === 'profile';
    const isEdit = mode === 'edit';

    this.usuarioForm = this.fb.group({
      nombre: isCreate || isEdit ? ['', Validators.required] : [{ value: '', disabled: true }],
      email: isCreate || isEdit
        ? ['', [Validators.email, Validators.required]]
        : [{ value: '', disabled: true }],
      role: isEdit ? ['', Validators.required] : [{ value: '', disabled: true }],
      estado: isEdit ? ['', Validators.required] : [{ value: '', disabled: true }],
      password: isCreate ? ['', Validators.required] : [{ value: '', disabled: true }],
      confirmarPassword: isCreate ? ['', Validators.required] : [{ value: '', disabled: true }],
      biografia: isProfile ? [''] : [{ value: '', disabled: true }],
      telefono: isProfile ? [''] : [{ value: '', disabled: true }],
      direccion: isProfile ? [''] : [{ value: '', disabled: true }],
      avatarUrl: isProfile ? [''] : [{ value: '', disabled: true }],
    });
  }

  async subirArchivo(event: any) {
    const archivo = event.target.files[0];
    try {
      const urlFile = await this.fileService.convertirArchivoAUrl(archivo);
      this.previewUrl.set(urlFile);
      this.usuarioForm.patchValue({ avatarUrl: urlFile });
    } catch (err) {
      this.snackBarService.open('Error al subir el archivo.');
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.snackBarService.open('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const formValue = this.usuarioForm.getRawValue();
    let operation: Observable<unknown> | null = null;

    switch (this.modeForm()) {
      case 'create': {
        const usuarioReq: UsuarioReq = {
          email: formValue.email,
          nombre: formValue.nombre,
          password: formValue.password,
        };
        operation = this.usuarioService.registrarUsuario(usuarioReq);
        break;
      }
      case 'profile':
        operation = this.perfilUsuario.actualizarPerfilUsuario(formValue);
        break;
      case 'edit':
        const usuarioReqEdit : UsuarioReq = {
          nombre : formValue.nombre,
          email : formValue.email,
          role : formValue.role,
          activo : formValue.estado === 'activo' ? true : false,
        }
        operation = this.usuarioService.editarUsuario(this.dataDialog.usuario.id,usuarioReqEdit);
        break;
      default:
        this.snackBarService.open('Modo de formulario no reconocido.');
        return;
    }

    operation?.subscribe({
      next: () => {
        if (this.modeForm() === 'create') {
          this.usuarioForm.reset();
          this.snackBarService.open('Usuario creado con éxito.');
        } else if (this.modeForm() === 'profile') {
          this.previewUrl.set(null);
          this.snackBarService.open('Perfil de usuario actualizado con éxito.');
        } else {
          this.snackBarService.open('Usuario actualizado con éxito.');
        }
      },
      error: () => {
        this.snackBarService.open('Error al realizar la operación.');
      },
    });
  }
}
