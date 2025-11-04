import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClienteEntity } from './cliente.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity("ventas")
export class Venta {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('decimal') total: number;

  @ManyToOne(() => ClienteEntity)
  clienteId: ClienteEntity;

  @OneToMany(() => DetalleVenta, (d) => d.ventaId, { cascade: true })
  detalles: DetalleVenta[];

  @CreateDateColumn() fechaCreacion: Date;
  @CreateDateColumn() fechaActualizacion: Date;

}