import { SnackbarService } from './../../../../services/snackbar-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../../../services/clientes-service';
import { TipoDocumento } from '../../../../modelos/documento.enum';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ClientesForm } from '../../../clientes/components/clientes-form/clientes-form';
import { ProductosServices } from '../../../../services/productos-service';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Productos } from '../../../../modelos/producto';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { VentaDTO, VentasService } from '../../../../services/ventas-service';

@Component({
  selector: 'app-ventas-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatTableModule,
    CurrencyPipe,
  ],

  templateUrl: './ventas-form.html',
})
export class VentasForm implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClientesService);
  private productoService = inject(ProductosServices);
  private ventaService = inject(VentasService);
  private snackBarService = inject(SnackbarService);
  private dialog = inject(MatDialog);

  public ventaForm = this.fb.group({
    tipoDocumento: ['', Validators.required],
    documento: ['', Validators.required],
    nombre: [{ value: '', disabled: true }],
    apellido: [{ value: '', disabled: true }],
  });

  public tiposDocumento = signal<TipoDocumento[]>([
    TipoDocumento['Cédula de Ciudadanía'],
    TipoDocumento['Cédula de Extranjería'],
    TipoDocumento['NIT'],
  ]);

  public productos = signal<Productos[]>([]);
  public carrito = signal<any[]>([]);

  ngOnInit(): void {
    this.listarProductos();
  }

  public displayedColumns = ['nombre', 'cantidad', 'precio', 'subtotal', 'eliminar'];

  public total = computed(() => {
    return this.carrito().reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  });

  onSubmit() {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      this.snackBarService.open('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    if (this.carrito().length == 0) {
      this.snackBarService.open('Por favor, debes agregar al menos un producto');
      return;
    }

    const ventaBody: VentaDTO = {
      // tipoDoc : this.ventaForm.get('tipoDocumento')?.value || undefined,
      documento: this.ventaForm.get('documento')?.value || undefined,
      productos: this.carrito().map((c) => {
        return {
          nombre: c.nombre,
          cantidad: c.cantidad,
        };
      }),
    };


    this.ventaService.realizarVenta(ventaBody).subscribe({
      next: () => {
        this.ventaForm.reset();
        this.carrito.update(() => []);
        this.snackBarService.open('Venta realizada con éxito');
      },
      error: (error) => {
        this.snackBarService.open('Error al realizar la venta');
        console.error('Error al realizar la venta', error);
      },
    });
  }

  consultarCliente() {
    const filtros = {
      tipoDocumento: this.ventaForm.get('tipoDocumento')?.value || undefined,
      documento: this.ventaForm.get('documento')?.value || undefined,
    };
    this.clienteService.filtrarClientes(filtros).subscribe((resp) => {
      if (resp.data.length == 0) {
        this.dialog.open(ClientesForm);
      } else {
        this.ventaForm.patchValue({
          nombre: resp.data[0].nombre,
          apellido: resp.data[0].apellido,
        });
      }
    });
  }

  listarProductos() {
    this.productoService.filtrarProductos({}).subscribe((resp) => {
      this.productos.set(resp.data);
    });
  }

  agregarProducto(prod: Productos) {
    const carritoActual = [...this.carrito()];
    const existe = carritoActual.find((p) => p.id === prod.id);

    // Solo descuenta stock si hay suficiente
    if (prod.stock > 0) {
      if (existe) {
        existe.cantidad++;
      } else {
        carritoActual.push({ ...prod, cantidad: 1 });
      }
      // Actualiza el stock del producto en la lista de productos
      this.productos.update((productos) =>
        productos.map((p) => (p.id === prod.id ? { ...p, stock: p.stock - 1 } : p))
      );
      this.carrito.set(carritoActual);
    }
  }

  eliminarProducto(prodId: string) {
    const carritoActual = this.carrito();
    const prodEnCarrito = carritoActual.find((p) => p.id === prodId);

    if (prodEnCarrito) {
      // Devuelve el stock original al eliminar
      this.productos.update((productos) =>
        productos.map((p) =>
          p.id === prodId ? { ...p, stock: p.stock + prodEnCarrito.cantidad } : p
        )
      );
      this.carrito.set(carritoActual.filter((p) => p.id !== prodId));
    }
  }
}
