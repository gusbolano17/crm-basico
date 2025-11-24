import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActionsTable, ColumnType, Table } from '../../../../layout/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioEntity } from '../../../../modelos/usuario-entity';
import { UsuariosService } from '../../../../services/usuarios-service';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { passwordMatchValidator } from '../../../../core/validator-pass';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-usuario-query',
  imports: [
    MatCardModule,
    Table,
    MatDialogContent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './usuario-query.html',
})
export class UsuarioQuery implements OnInit {
  private usuarioService = inject(UsuariosService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);
  private destroyRef = inject(DestroyRef);

  public passForm = this.fb.group(
    {
      password: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  public filtrosForm = this.fb.group({
    desde: [''],
    hasta: [''],
    search: [''],
    roles: [''],
    estado: [''],
  });

  @ViewChild('modalpass') modalPass!: TemplateRef<any>;

  public datasource = signal<MatTableDataSource<UsuarioEntity>>(
    new MatTableDataSource<UsuarioEntity>([])
  );
  public displayedColumns: ColumnType[] = [
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'email', label: 'Correo', type: 'text' },
    { key: 'role', label: 'Rol', type: 'text' },
    { key: 'activo', label: 'Estado', type: 'boolean' },
    { key: 'acciones', label: 'Acciones', type: 'actions' },
  ];

  public actions: ActionsTable[] = [
    {
      label: 'Editar',
      class: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2',
      callback: (row: UsuarioEntity) => this.actualizarUsuarioDialog(row),
    },
    {
      label: 'Contraseña',
      class: 'bg-cyan-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2',
      callback: (row: UsuarioEntity) => this.actualizarPassDialog(row),
    },
  ];

  public selectFiltros = signal([
    { value: null, viewValue: 'Seleccione un filtro' },
    { value: 'search', viewValue: 'Buscar en todo' },
    { value: 'roles', viewValue: 'Roles' },
    { value: 'estado', viewValue: 'Estado' },
    { value: 'rangoFecha', viewValue: 'Rango de Fecha' },
  ]);

  public selectEstadosUsuarios = signal([
    { value: 'Activo', viewValue: 'Activo' },
    { value: 'Inactivo', viewValue: 'Inactivo' },
  ]);

  public selectRolesUsuarios = signal([
    { value: 'admin', viewValue: 'Admin' },
    { value: 'user', viewValue: 'User' },
    { value: 'vendedor', viewValue: 'Vendedor' },
    { value: 'supervisor', viewValue: 'Supervisor' }
  ]);

  public filtroSeleccionado = signal<string | null>(null);

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const desdeValue = this.filtrosForm.get('desde')?.value;
    const hastaValue = this.filtrosForm.get('hasta')?.value;

    const estadoValue = this.filtrosForm.get('estado')?.value;

    const filtros = {
      desde: desdeValue ? new Date(desdeValue).toISOString().split('T')[0] : undefined,
      hasta: hastaValue ? new Date(hastaValue).toISOString().split('T')[0] : undefined,
      estado: estadoValue !== null && estadoValue !== '' ? estadoValue === 'Activo' : undefined,
      search: this.filtrosForm.get('search')?.value || undefined,
      role: this.filtrosForm.get('roles')?.value || undefined,
    };

    this.usuarioService
      .listarUsuarios(filtros)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.datasource.set(new MatTableDataSource(res.data));
        },
        error: (err) => console.error(err),
      });
  }

  handleSelectChange(event: any) {
    this.filtroSeleccionado.set(event.value);
    this.filtrosForm.reset();
    if (this.filtroSeleccionado() == null) {
      this.obtenerUsuarios();
    }
  }

  actualizarUsuarioDialog(usuario: UsuarioEntity) {
    this.dialog.open(UsuarioForm, {
      data: {
        usuario,
        mode: 'edit',
      },
    });
  }

  actualizarPassDialog(usuario: UsuarioEntity) {
    this.dialog.open(this.modalPass, {
      data: usuario,
    });
  }

  cambiarPassword(idUsuario: string) {
    if (this.passForm.valid) {
      const pass = this.passForm.get('password')?.value ?? '';
      this.usuarioService.cambiarPassword(idUsuario, pass).subscribe({
        next: (resp) => {
          this.dialog.closeAll();
          this.passForm.reset();
          this.snackbarService.open('Contraseña actualizada con éxito', 'Cerrar');
        },
        error: (err) => {
          this.snackbarService.open('Error al actualizar la contraseña', 'Cerrar');
        },
      });
    }
  }
}
