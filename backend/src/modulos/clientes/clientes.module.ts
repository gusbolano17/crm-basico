import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../../entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteEntity])],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService]
})
export class ClientesModule {}
