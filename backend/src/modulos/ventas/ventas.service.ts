import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from '../../entities/venta.entity';
import { Repository } from 'typeorm';
import { DetalleVenta } from '../../entities/detalle-venta.entity';
import { ClientesService } from '../clientes/clientes.service';
import { ProductosService } from '../productos/productos.service';
import { VentasDTO } from '../../entities/dto/ventasDTO';
import { ProductoEntity } from '../../entities/producto.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
    private clientesService: ClientesService,
    private productosService: ProductosService,
  ) {}

  async registrarVenta(venta: VentasDTO): Promise<Venta> {
    const cliente = await this.clientesService.obtenerCLienteDoc(
      venta.clienteId,
    );
    if (!cliente) throw new Error('El cliente no existe');

    let productos: ProductoEntity[] = [];
    for (const prod of venta.productos) {
      const producto = await this.productosService.obtenerProductoNombre(prod);
      if (!producto) throw new Error('El producto no existe');
      productos.push(producto);
    }

    const nuevaVenta = this.ventaRepository.create({
      clienteId: cliente,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      total: productos.reduce((acc, prod) => acc + prod.precio, 0),
    });

    const ventaGuardada = await this.ventaRepository.save(nuevaVenta);

    if (ventaGuardada) {
      await this.registrarDetalleVenta(productos, ventaGuardada);
    } else {
      throw new Error('Error al registrar la venta');
    }

    return ventaGuardada;
  }

  async listarVentas(): Promise<Venta[]> {
    return await this.ventaRepository.find();
  }

  private async registrarDetalleVenta(productos: ProductoEntity[], venta: Venta): Promise<void> {
    venta.detalles = await Promise.all(
      productos.map(async (producto) => {
        const detalleVenta = this.detalleVentaRepository.create({
          productoId: producto,
          ventaId: venta,
          cantidad: productos.length,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
          subtotal: producto.precio * productos.length,
        });
        const saved = await this.detalleVentaRepository.save(detalleVenta);
        await this.productosService.modificarStock(producto.id, producto.stock - productos.length);
        return saved;
      }),
    );
    await this.ventaRepository.save(venta);
  }
}
