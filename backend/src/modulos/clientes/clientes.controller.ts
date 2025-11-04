import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from '../../entities/dto/create-cliente.dto';
import { UpdateClienteDto } from '../../entities/dto/update-cliente.dto';
import { ClienteEntity } from '../../entities/cliente.entity';
import { FiltroClienteDto } from '../../entities/dto/filtro-cliente-dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post("registrar")
  async registrarClientes(@Body() createClienteDto: CreateClienteDto) : Promise<ClienteEntity> {
    return await this.clientesService.registrarClientes(createClienteDto);
  }

  @Get("listar")
  async listarClientes() {
    return await this.clientesService.listarClientes();
  }

  @Get("filtrar")
  async filtrarClientes(@Query() filtros: FiltroClienteDto) {
    return this.clientesService.filtrarClientes(filtros);
  }

  @Put("actualizar/:id")
  async actualizarCliente(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) : Promise<ClienteEntity> {
    return await this.clientesService.actualizarCliente(id, updateClienteDto);
  }

  @Delete("eliminar/:id")
  async eliminarCliente(@Param('id') id: string) : Promise<void> {
    return await this.clientesService.eliminarCliente(id);
  }
}
