import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClienteEntity } from '../../entities/cliente.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../../entities/producto.entity';
import { Venta } from '../../entities/venta.entity';
import { DetalleVenta } from '../../entities/detalle-venta.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ClienteEntity)
    private clientesRepository: Repository<ClienteEntity>,
    @InjectRepository(ProductoEntity)
    private productosRepository: Repository<ProductoEntity>,
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async obtenerResumen(): Promise<{ totalClientes, totalProductos, totalVentas}> {
    const totalClientes = await this.clientesRepository.count();
    const totalProductos = await this.productosRepository.count();
    const totalVentas = await this.ventasRepository.count();

    return {totalClientes, totalProductos, totalVentas};
  }

  async obtenerVentasPorMes() {
    return await this.ventasRepository
      .createQueryBuilder('venta')
      .select('TO_CHAR(venta.fechaCreacion, \'YYYY-MM\')', 'mes')
      .addSelect('COUNT(*)', 'totalVentas')
      .groupBy('TO_CHAR(venta.fechaCreacion, \'YYYY-MM\')')
      .orderBy('mes', 'ASC')
      .getRawMany();
  }

  async obtenerVentasPorDia() {
    return await this.ventasRepository
      .createQueryBuilder('venta')
      .select('TO_CHAR(venta.fechaCreacion, \'YYYY-MM-DD\')', 'dia')
      .addSelect('COUNT(*)', 'totalVentas')
      .groupBy('TO_CHAR(venta.fechaCreacion, \'YYYY-MM-DD\')')
      .orderBy('dia', 'ASC')
      .getRawMany();
  }

  async topProductos(){
    return await this.detalleVentaRepository
      .createQueryBuilder('detalleVenta')
      .select('producto.nombre', 'nombre')
      .addSelect('SUM(detalleVenta.cantidad)', 'cantidad')
      .innerJoin('detalleVenta.productoId', 'producto')
      .groupBy('producto.nombre')
      .orderBy('cantidad', 'DESC')
      .limit(5)
      .getRawMany();
  }
}
