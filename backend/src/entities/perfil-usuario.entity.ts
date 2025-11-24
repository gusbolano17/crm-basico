// perfil-usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';


@Entity('perfil_usuario')
export class PerfilUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  biografia: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @OneToOne(() => UsuarioEntity, usuario => usuario.perfil, { eager: true })
  @JoinColumn()
  usuario: UsuarioEntity;
}