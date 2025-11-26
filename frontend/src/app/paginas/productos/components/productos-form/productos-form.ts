import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelect, MatOption, MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../../../modelos/categoria';
import { ProductoReq, ProductosServices } from '../../../../services/productos-service';
import { SnackbarService } from '../../../../services/snackbar-service';
import { CategoriasService } from '../../../../services/categorias-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CurrencyDirective } from '../../../../core/currency';


@Component({
  selector: 'app-productos-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    CurrencyDirective
],
  templateUrl: './productos-form.html',
})
export class ProductosForm implements OnInit {
  private productoS = inject(ProductosServices);
  private categoriaS = inject(CategoriasService);
  private snackbarService = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  public categorias = signal<Categoria[]>([]);

  public dataDialog = inject(MAT_DIALOG_DATA, { optional: true });

  public productoForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, Validators.required],
    stock: [0, Validators.required],
    categoria: ['', Validators.required],
  });

  ngOnInit(): void {

    if(this.dataDialog && this.dataDialog.producto){
      const producto = this.dataDialog.producto;
      this.productoForm.patchValue({
        ...producto,
        precio: +producto.precio,
        categoria : producto.categoria.nombre
      });
    }

    this.categoriaS
      .listarCategorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resp) => {
        this.categorias.set(resp);
      });
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.snackbarService.open('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const body: ProductoReq = this.productoForm.value as ProductoReq;
    const isEdit = this.dataDialog?.isEdit;
    
    const operation = !isEdit ?this.productoS.agregarProductos(body):
    this.productoS.editarProductos(this.dataDialog.producto.id,body);

    operation.subscribe({
      next: () => {
        !isEdit ? this.productoForm.reset() : null;
        this.snackbarService.open(`Producto ${isEdit ? 'actualizado' : 'creado'} con éxito`);
      },
      error: (error) => {
        this.snackbarService.open(`Error al ${isEdit ? 'actualizar' : 'crear'} el producto`);
        console.error(`Error al ${isEdit ? 'actualizar' : 'crear'} el producto:`, error);
      }
    });
  }

  onReset() {
    this.productoForm.reset();
  }
}
