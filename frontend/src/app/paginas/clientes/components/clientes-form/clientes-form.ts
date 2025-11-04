import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from "@angular/material/button";
import { ClienteReq, ClientesService } from '../../../../services/clientes-service';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoDocumento } from '../../../../modelos/documento.enum';

@Component({
  selector: 'app-clientes-form',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatListModule, MatSelectModule, MatButtonModule],
  templateUrl: './clientes-form.html'
})
export class ClientesForm implements OnInit{

  private clienteService = inject(ClientesService);
  private snackbarService = inject(SnackbarService);
  private fb = inject(FormBuilder);

  public dataDialog = inject(MAT_DIALOG_DATA, { optional: true });

  public tiposDocumento = signal<TipoDocumento[]>([
    TipoDocumento['Cédula de Ciudadanía'],
    TipoDocumento['Cédula de Extranjería'],
    TipoDocumento['NIT']
  ]);

  public clienteForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    tipoDocumento: ['', Validators.required],
    documento: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: ['']
  });

  ngOnInit() {
    if (this.dataDialog && this.dataDialog.cliente) {
      const cliente = this.dataDialog.cliente;
      this.clienteForm.patchValue(cliente);
    }
  }

  onSubmit() {
    if (!this.clienteForm.valid) {
      this.clienteForm.markAllAsTouched();
      this.snackbarService.open('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    const formValue: ClienteReq = this.clienteForm.value as ClienteReq;
    const isEdit = this.dataDialog?.edit;
    const operation = isEdit ? 
      this.clienteService.actualizarCliente(this.dataDialog.cliente.id, formValue) : 
      this.clienteService.crearCliente(formValue);

    operation.subscribe({
      next: () => {
        !isEdit ? this.clienteForm.reset() : null;
        this.snackbarService.open(`Cliente ${isEdit ? 'actualizado' : 'creado'} con éxito`);
      },
      error: (error) => {
        this.snackbarService.open(`Error al ${isEdit ? 'actualizar' : 'crear'} el cliente`);
        console.error(`Error al ${isEdit ? 'actualizar' : 'crear'} el cliente:`, error);
      }
    });
  }

  onReset() {
    this.clienteForm.reset();
  }
}
