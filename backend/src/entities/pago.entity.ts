import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FormaPago } from './forma-pago-enum';
import { Venta } from './venta.entity';

@Entity("pagos")
export class Pago {

  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() monto: number;
  @Column() fecha: Date;
  @Column({
      type: 'enum',
      enum: FormaPago,
    })
  formaPago: FormaPago;
  @ManyToOne(() => Venta)
  ventaId: Venta;
  @CreateDateColumn() fechaPago: Date;

}