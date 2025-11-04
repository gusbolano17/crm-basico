import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column() role: string;
  @Column() nombre: string;
  @Column({ default: true }) activo: boolean;
  @Column({nullable: true}) refreshToken: string;
  @CreateDateColumn() creado: Date;
  @UpdateDateColumn() actualizado: Date;
}
