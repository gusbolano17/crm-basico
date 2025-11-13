import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Venta } from '../../../../modelos/venta';
import { PagoDTO, VentasService } from '../../../../services/ventas-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SnackbarService } from '../../../../services/snackbar-service';
import { MetodoPago } from '../../../../modelos/metodo-pago.enum';
import { TipoDocumento } from '../../../../modelos/documento.enum';

@Component({
  selector: 'app-ventas-query',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CurrencyPipe,
    DatePipe,
    NgClass,
  ],
  templateUrl: './ventas-query.html',
})
export class VentasQuery implements OnInit {
  private fb = inject(FormBuilder);
  private ventasService = inject(VentasService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private snackbarService = inject(SnackbarService);

  @ViewChild('detalleVenta') detalleVenta!: TemplateRef<any>;
  @ViewChild('modalpago') modalPago!: TemplateRef<any>;

  public filtrosForm = this.fb.group({
    desde: [''],
    hasta: [''],
    tipoDocumento: [''],
    documento: [''],
    estado: [''],
  });

  public pagoForm = this.fb.group({
    metodoPago: [''],
    monto: [0],
  });

  public ventas: Venta[] = [];
  public columnas: string[] = ['cliente', 'fecha', 'total', 'estado', 'acciones'];

  public selectFiltros = signal([
    { value: null, viewValue: 'Seleccione un filtro' },
    { value: 'estado', viewValue: 'Estado de la venta' },
    { value: 'cliente', viewValue: 'Cliente' },
    { value: 'rangoFecha', viewValue: 'Rango de Fecha' },
  ]);

  public selectEstadosVentas = signal([
    { value: 'ACTIVA', viewValue: 'Activa' },
    { value: 'FINALIZADA', viewValue: 'Pagada' },
    { value: 'CANCELADA', viewValue: 'Anulada' },
  ]);

  public tiposDocumento = signal<TipoDocumento[]>([
    TipoDocumento['Cédula de Ciudadanía'],
    TipoDocumento['Cédula de Extranjería'],
    TipoDocumento['NIT'],
  ]);

  public metodosPago = signal<MetodoPago[]>([
    MetodoPago.EFECTIVO,
    MetodoPago.TARJETA,
    MetodoPago.TRANSFERENCIA,
  ]);

  public filtroSeleccionado = signal<string | null>(null);

  public datasource = signal<MatTableDataSource<Venta>>(new MatTableDataSource<Venta>([]));

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas() {
    const desdeValue = this.filtrosForm.get('desde')?.value;
    const hastaValue = this.filtrosForm.get('hasta')?.value;

    const filtros = {
      desde: desdeValue ? new Date(desdeValue).toISOString().split('T')[0] : undefined,
      hasta: hastaValue ? new Date(hastaValue).toISOString().split('T')[0] : undefined,
      estado: this.filtrosForm.get('estado')?.value || undefined,
      tipoDocumento: this.filtrosForm.get('tipoDocumento')?.value || undefined,
      documento: this.filtrosForm.get('documento')?.value || undefined,
    };

    this.ventasService
      .listarVentas(filtros)
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
      this.obtenerVentas();
    }
  }

  verDetalle(det: any) {
    this.dialog.open(this.detalleVenta, { data: det });
  }

  anularVenta(ventaId: string) {
    this.snackbarService
      .alertDelete('¿Está seguro de que desea anular la venta', 'Anular')
      .afterDismissed()
      .subscribe((info) => {
        if (info.dismissedByAction) {
          this.ventasService.anularVenta(ventaId).subscribe({
            next: () => {
              this.snackbarService.open('Venta anulada con éxito');
              this.datasource.update((source) => new MatTableDataSource(source.data));
            },
            error: (error) => {
              this.snackbarService.open('Error al anular la venta');
            },
          });
        }
      });
  }

  realizarPago(venta: any) {
    this.dialog.open(this.modalPago, { data: venta });
  }

  confirmarPago(ventaId: string) {
    const pagoDto: PagoDTO = {
      formaPago: this.pagoForm.get('metodoPago')?.value || undefined,
      ventaId: ventaId,
      monto: this.pagoForm.get('monto')?.value || undefined,
    };

    this.snackbarService
      .alertDelete('¿Está seguro de que desea confirmar el pago', 'Pagar')
      .afterDismissed()
      .subscribe((info) => {
        if (info.dismissedByAction) {
          this.ventasService.realizarPago(pagoDto).subscribe({
            next: () => {
              this.snackbarService.open('Pago realizado con éxito');
            },
            error: (error) => {
              this.snackbarService.open('Error al realizar el pago');
            },
          });
        }
      });
  }
}
