import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PerfilUsuario } from './perfil-usuario.entity';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Exclude()
  @Column()
  password: string;
  @Column() role: string;
  @Column() nombre: string;
  @Column({ default: true }) activo: boolean;
  @Column({nullable: true}) refreshToken: string;
  @CreateDateColumn() creado: Date;
  @UpdateDateColumn() actualizado: Date;
  @OneToOne(() => PerfilUsuario, perfil => perfil.usuario)
  perfil: PerfilUsuario;
}
