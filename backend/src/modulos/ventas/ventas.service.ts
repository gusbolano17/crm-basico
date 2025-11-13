import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from '../../entities/venta.entity';
import { Repository } from 'typeorm';
import { DetalleVenta } from '../../entities/detalle-venta.entity';
import { ClientesService } from '../clientes/clientes.service';
import { ProductosService } from '../productos/productos.service';
import { VentasDTO } from '../../entities/dto/ventasDTO';
import { ProductoEntity } from '../../entities/producto.entity';
import { EstadosVentas } from '../../entities/estados-enums';
import { FiltroVentaDto } from '../../entities/dto/filtro-cliente-dto';
import { HistorialVenta } from '../../entities/historial-ventas.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(HistorialVenta)
    private historialVentaRepository: Repository<HistorialVenta>,
    private clientesService: ClientesService,
    private productosService: ProductosService,
  ) {}

  async registrarVenta(venta: VentasDTO, userId : string): Promise<Venta> {
    const cliente = await this.clientesService.obtenerCLienteDoc(
      venta.documento,
    );
    if (!cliente) throw new Error('El cliente no existe');

    const productos: ProductoEntity[] = [];
    const cantidades: number[] = [];

    for (const prod of venta.productos) {
      const producto = await this.productosService.obtenerProductoNombre(
        prod.nombre,
      );
      if (!producto) throw new Error('El producto no existe');
      productos.push(producto);
      cantidades.push(prod.cantidad);
    }

    const total = productos.reduce(
      (acc, prod, idx) => acc + prod.precio * (cantidades[idx] ?? 0),
      0,
    );

    const nuevaVenta = this.ventaRepository.create({
      clienteId: cliente,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      total,
    });

    const ventaGuardada = await this.ventaRepository.save(nuevaVenta);

    if (ventaGuardada) {
      await this.registrarDetalleVenta(productos, cantidades, ventaGuardada);
      await this.cambiarEstadoVenta(ventaGuardada.id, EstadosVentas.ACTIVA, userId);
    } else {
      throw new Error('Error al registrar la venta');
    }

    return ventaGuardada;
  }

  private async registrarDetalleVenta(
    productos: ProductoEntity[],
    cantidad: number[],
    venta: Venta,
  ): Promise<void> {
    if (!cantidad || cantidad.length !== productos.length) {
      throw new Error('Las cantidades no coinciden con los productos');
    }

    venta.detalles = await Promise.all(
      productos.map(async (producto, idx) => {
        const qty = cantidad[idx];
        const detalleVenta = this.detalleVentaRepository.create({
          productoId: producto,
          ventaId: venta,
          cantidad: qty,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          subtotal: producto.precio * qty,
        });
        const saved = await this.detalleVentaRepository.save(detalleVenta);
        await this.productosService.modificarStock(
          producto.id,
          producto.stock - qty,
        );
        return saved;
      }),
    );
    await this.ventaRepository.save(venta);
  }

  async listarVentas(filtros: FiltroVentaDto) {
    const {

      tipoDocumento,
      documento,
      estado,
      desde,
      hasta,
      page = '1',
      limit = '10',
      sort = 'fechaCreacion',
      dir = 'desc',
    } = filtros;

    const qb = this.ventaRepository
      .createQueryBuilder('ventas')
      .leftJoinAndSelect('ventas.clienteId', 'cliente')
      .leftJoinAndSelect('ventas.detalles', 'detalleVenta')
      .leftJoinAndSelect('detalleVenta.productoId', 'producto');

    if (tipoDocumento && documento) {
      qb.andWhere(
        'cliente.tipoDocumento = :tipoDocumento AND cliente.documento = :documento',
        { tipoDocumento, documento },
      );
    }

    if (estado && estado !== 'Todos') {
      qb.andWhere('ventas.estado = :estado', { estado });
    }

    if (desde) {
      const desdeDate = new Date(`${desde}T00:00:00`);
      qb.andWhere('ventas.fechaCreacion >= :desde', { desde: desdeDate });
    }

    if (hasta) {
      const hastaDate = new Date(`${hasta}T23:59:59.999`);
      qb.andWhere('ventas.fechaCreacion <= :hasta', { hasta: hastaDate });
    }

    qb.orderBy(`ventas.${sort}`, dir.toUpperCase() as 'ASC' | 'DESC');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    qb.skip(skip).take(parseInt(limit));

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / +limit),
    };
  }

  async obtenerVentaId(ventaId: string) {
    return await this.ventaRepository.findOne({
      where: { id: ventaId },
    });
  }

  async cambiarEstadoVenta(
    ventaId: string,
    estado: EstadosVentas,
    usuarioId: string,
  ): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id: ventaId },
    });

    if (!venta) {
      throw new Error('La venta no existe');
    }

    const histVenta = this.historialVentaRepository.create({
      estadoAnterior: venta.estado,
      estadoNuevo: estado,
      usuario: { id: usuarioId },
      observacion: `Cambio de estado a ${estado}`,
      venta: { id: ventaId },
      fechaCambio : new Date()
    });

    venta.estado = estado;
    venta.fechaActualizacion = new Date();

    await this.historialVentaRepository.save(histVenta);
    return await this.ventaRepository.save(venta);
  }
}
