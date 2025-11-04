import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() nombre: string;
  @Column() apellido: string;
  @Column() tipoDocumento: string;
  @Column({unique:true}) documento: string;
  @Column() email: string;
  @Column() telefono: string;
  @Column() direccion: string;
  @CreateDateColumn() creado: Date;
  @UpdateDateColumn() actualizado: Date;
}