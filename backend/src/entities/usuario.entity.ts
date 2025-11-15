import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column()
  @Exclude()
  password: string;
  @Column() role: string;
  @Column() nombre: string;
  @Column({ default: true }) activo: boolean;
  @Column({nullable: true}) refreshToken: string;
  @CreateDateColumn() creado: Date;
  @UpdateDateColumn() actualizado: Date;
}
