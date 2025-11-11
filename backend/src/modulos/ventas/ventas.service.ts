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
    venta.documento,
  );
  if (!cliente) throw new Error('El cliente no existe');

  const productos: ProductoEntity[] = [];
  const cantidades: number[] = [];

  for (const prod of venta.productos) {
    const producto = await this.productosService.obtenerProductoNombre(prod.nombre);
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
  } else {
    throw new Error('Error al registrar la venta');
  }

  return ventaGuardada;
}

private async registrarDetalleVenta(productos: ProductoEntity[], cantidad: number[], venta: Venta): Promise<void> {
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
      await this.productosService.modificarStock(producto.id, producto.stock - qty);
      return saved;
    }),
  );
  await this.ventaRepository.save(venta);
}



  async listarVentas(): Promise<Venta[]> {
    return await this.ventaRepository.find();
  }

  async obtenerVentaId(ventaId: string) {
    return await this.ventaRepository.findOne({
      where: { id: ventaId },
    });
  }

  async cambiarEstadoVenta(venta : Venta, estado : EstadosVentas){
    return await this.ventaRepository.save({
      ...venta,
      estado,
      fechaActualizacion: new Date()
    })
  }



}
