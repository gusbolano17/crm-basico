import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ClientesService } from '../../../../services/clientes-service';
import { Cliente } from '../../../../modelos/cliente';
import { ClientesForm } from '../clientes-form/clientes-form';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TipoDocumento } from '../../../../modelos/documento.enum';
import { ActionsTable, ColumnType, Table } from '../../../../layout/table/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-clientes-query',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    Table,
  ],
  templateUrl: './clientes-query.html',
})
export class ClientesQuery implements OnInit {
  private readonly clienteService = inject(ClientesService);
  private readonly snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  public filtroForm = inject(FormBuilder).group({
    tipoDocumento: [''],
    documento: [''],
    desde: [''],
    hasta: [''],
    search: [''],
  });

  public datasource = signal<MatTableDataSource<Cliente>>(new MatTableDataSource<Cliente>([]));
  public total = signal<number>(0);
  public selectFiltros = signal([
    { value: null, viewValue: 'Seleccione un filtro' },
    { value: 'search', viewValue: 'Buscar en todo' },
    { value: 'documento', viewValue: 'Documento' },
    { value: 'rangoFecha', viewValue: 'Rango de Fecha' },
  ]);
  public filtroSeleccionado = signal<string | null>(null);
  public tiposDocumento = signal<TipoDocumento[]>([
    TipoDocumento['Cédula de Ciudadanía'],
    TipoDocumento['Cédula de Extranjería'],
    TipoDocumento['NIT'],
  ]);

  public displayedColumns: ColumnType[] = [
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'documento', label: 'Documento', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'text' },
    { key: 'email', label: 'Correo', type: 'text' },
    { key: 'acciones', label: 'Acciones', type: 'actions' },
  ];

  public actions: ActionsTable[] = [
    {
      label: 'Editar',
      class: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2',
      callback: (row: Cliente) => this.actualizarClienteDialog(row),
    },
    {
      label: 'Eliminar',
      class: 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded',
      callback: (row: Cliente) => this.eliminarCliente(row.id),
    },
  ];

  ngOnInit() {
    this.obtenerClientes();
  }

  handleSelectChange(event: any) {
    this.filtroSeleccionado.set(event.value);
  }

  obtenerClientes() {
    const desdeValue = this.filtroForm.get('desde')?.value;
    const hastaValue = this.filtroForm.get('hasta')?.value;

    const filtros = {
      tipoDocumento: this.filtroForm.get('tipoDocumento')?.value || undefined,
      documento: this.filtroForm.get('documento')?.value || undefined,
      desde: desdeValue ? new Date(desdeValue).toISOString().split('T')[0] : undefined,
      hasta: hastaValue ? new Date(hastaValue).toISOString().split('T')[0] : undefined,
      search: this.filtroForm.get('search')?.value || undefined,
    };

    this.clienteService
      .filtrarClientes(filtros)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.datasource.set(new MatTableDataSource(res.data));
          this.total.set(res.total);
        },
        error: (err) => console.error(err),
      });
  }

  limpiarFiltros() {
    this.filtroForm.reset();
    this.obtenerClientes();
  }

  public actualizarClienteDialog(cliente: Cliente) {
    this.dialog
      .open(ClientesForm, {
        data: {
          cliente: cliente,
          edit: true,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.clienteService.listarClientes().subscribe((clientes) => {
          this.datasource.set(new MatTableDataSource(clientes));
        });
      });
  }

  public eliminarCliente(id: string) {
    this.snackbarService
      .alertDelete('¿Está seguro de que desea eliminar este cliente?', 'Eliminar')
      .afterDismissed()
      .subscribe((info) => {
        if (info.dismissedByAction) {
          this.clienteService.eliminarCliente(id).subscribe({
            next: () => {
              this.snackbarService.open('Cliente eliminado con éxito');
              this.datasource.update(
                (source) =>
                  new MatTableDataSource(source.data.filter((cliente) => cliente.id !== id))
              );
            },
            error: (error) => {
              this.snackbarService.open('Error al eliminar el cliente');
              console.error('Error al eliminar el cliente:', error);
            },
          });
        }
      });
  }
}
