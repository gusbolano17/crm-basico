import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { EstadosVentas } from './estados-enums';
import { UsuarioEntity } from './usuario.entity';

@Entity('historial_ventas')
export class HistorialVenta {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Venta, { eager: true })
  venta: Venta;

  @Column({
    type: 'enum',
    enum: EstadosVentas,
  })
  estadoAnterior: EstadosVentas;

  @Column({
    type: 'enum',
    enum: EstadosVentas,
  })
  estadoNuevo: EstadosVentas;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  usuario: UsuarioEntity;

  @Column({ nullable: true })
  observacion: string;

  @CreateDateColumn()
  fechaCambio: Date;
}
