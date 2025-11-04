import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { Venta } from './venta.entity';

@Entity("detalle_ventas")
export class DetalleVenta {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() cantidad: number;

  @Column('decimal') subtotal: number;

  @CreateDateColumn() fechaCreacion: Date;

  @CreateDateColumn() fechaActualizacion: Date;

  @ManyToOne(() => ProductoEntity)
  productoId: ProductoEntity;

  @ManyToOne(() => Venta, (v) => v.detalles)
  ventaId: Venta;

}