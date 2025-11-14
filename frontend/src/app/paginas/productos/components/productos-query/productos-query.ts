import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Productos } from '../../../../modelos/producto';
import { ProductosServices } from '../../../../services/productos-service';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductosForm } from '../productos-form/productos-form';
import { Categoria } from '../../../../modelos/categoria';
import { CategoriasService } from '../../../../services/categorias-service';
import { ActionsTable, ColumnType, Table } from '../../../../layout/table/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-productos-query',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    Table,
  ],
  templateUrl: './productos-query.html',
})
export class ProductosQuery implements OnInit {
  private readonly productosService = inject(ProductosServices);
  private readonly categoriaService = inject(CategoriasService);
  private readonly snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  public filtroForm = inject(FormBuilder).group({
    categoria: [''],
    desde: [''],
    hasta: [''],
    search: [''],
  });

  public selectFiltros = signal([
    { value: null, viewValue: 'Seleccione un filtro' },
    { value: 'search', viewValue: 'Buscar en todo' },
    { value: 'categoria', viewValue: 'Categoria' },
    { value: 'rangoFecha', viewValue: 'Rango de Fecha' },
  ]);
  public filtroSeleccionado = signal<string | null>(null);
  public categorias = signal<Categoria[]>([]);

  public displayedColumns: ColumnType[] = [
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'categoria.nombre', label: 'Categoría', type: 'text' },
    { key: 'acciones', label: 'Acciones', type: 'actions' },
  ];

  public datasource = signal<MatTableDataSource<Productos>>(new MatTableDataSource<Productos>([]));
  public total = signal<number>(0);

  public actions: ActionsTable[] = [
    {
      label: 'Editar',
      class: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2',
      callback: (row: Productos) => this.actualizarProductoDialog(row),
    },
    {
      label: 'Eliminar',
      class: 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded',
      callback: (row: Productos) => this.eliminarProducto(row.id),
    },
  ];

  ngOnInit(): void {
    this.obtenerProductos();
    this.categoriaService.listarCategorias().subscribe((resp) => {
      this.categorias.set(resp);
    });
  }

  handleSelectChange(event: any) {
    this.filtroSeleccionado.set(event.value);
    this.filtroForm.reset();
    if (this.filtroSeleccionado() == null) {
      this.obtenerProductos();
    }
  }

  obtenerProductos() {
    const desdeValue = this.filtroForm.get('desde')?.value;
    const hastaValue = this.filtroForm.get('hasta')?.value;

    const filtros = {
      desde: desdeValue ? new Date(desdeValue).toISOString().split('T')[0] : undefined,
      hasta: hastaValue ? new Date(hastaValue).toISOString().split('T')[0] : undefined,
      search: this.filtroForm.get('search')?.value || undefined,
      categoria: this.filtroForm.get('categoria')?.value || undefined,
    };

    this.productosService
      .filtrarProductos(filtros)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.datasource.set(new MatTableDataSource(res.data));
          this.total.set(res.total);
        },
        error: (err) => console.error(err),
      });
  }

  actualizarProductoDialog(producto: Productos) {
    this.dialog
      .open(ProductosForm, {
        data: {
          producto,
          isEdit: true,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.obtenerProductos();
      });
  }

  eliminarProducto(id: string) {
    this.snackbarService
      .alertDelete('¿Está seguro de que desea eliminar este producto?', 'Eliminar')
      .afterDismissed()
      .subscribe((info) => {
        if (info.dismissedByAction) {
          this.productosService.eliminarProducto(id).subscribe({
            next: () => {
              this.snackbarService.open('Producto eliminado con éxito');
              this.datasource.update(
                (source) =>
                  new MatTableDataSource(source.data.filter((producto) => producto.id !== id))
              );
            },
            error: (error) => {
              this.snackbarService.open('Error al eliminar el producto');
              console.error('Error al eliminar el cliente:', error);
            },
          });
        }
      });
  }
}
