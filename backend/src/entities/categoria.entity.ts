import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("categoria")
export class Categoria {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() nombre: string;
}