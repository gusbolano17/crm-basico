import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

@Entity('productos')
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() nombre: string;
  @Column() descripcion: string;
  @Column({type : "decimal"}) precio: number;
  @Column({type : "integer"}) stock: number;
  @CreateDateColumn() creado: Date;
  @CreateDateColumn() actualizado: Date;
  @ManyToOne(() => Categoria, (c) => c.id)
  categoria: Categoria;
}