import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../entities/pago.entity';
import { VentasService } from './ventas/ventas.service';
import { PagoDTO } from '../entities/dto/pagoDTO';
import { FormaPago } from '../entities/forma-pago-enum';
import { EstadosVentas } from '../entities/estados-enums';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private pagosRepository: Repository<Pago>,
    private ventaService: VentasService,
  ) {}

  async realizarPago(pago: PagoDTO, usuario : string): Promise<Pago> {
    // Obtener y validar venta
    const venta = await this.ventaService.obtenerVentaId(pago.ventaId);
    if (!venta) {
      throw new Error('La venta no existe');
    }

    // Validar estado de la venta
    if (venta.estado === EstadosVentas.FINALIZADA) {
      throw new Error('La venta ya está finalizada');
    }

    if (venta.estado === EstadosVentas.CANCELADA) {
      throw new Error('No se puede pagar una venta cancelada');
    }

    // Validar monto
    if (pago.monto < venta.total) {
      throw new Error(
        `El monto $${pago.monto} no puede ser menor al total de la venta $${venta.total}`,
      );
    }

    // Validar y convertir forma de pago
    if (!Object.values(FormaPago).includes(pago.formaPago as FormaPago)) {
      throw new Error(`Forma de pago ${pago.formaPago} no válida`);
    }

    // Crear pago
    const nuevoPago = this.pagosRepository.create({
      ventaId: venta,
      monto: pago.monto,
      formaPago: pago.formaPago as FormaPago,
      fechaPago: new Date(),
      fecha : new Date(),
    });

    try {
      // Guardar pago y actualizar estado de venta en una transacción
      const pagoGuardado = await this.pagosRepository.save(nuevoPago);
      await this.ventaService.cambiarEstadoVenta(
        venta.id,
        EstadosVentas.FINALIZADA,
        usuario
      );
      return pagoGuardado;
    } catch (error) {
      throw new Error(`Error al procesar el pago: ${error.message}`);
    }
  }
}
