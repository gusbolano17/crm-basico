import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get('listar')
  async obtenerCategorias() {
    return await this.categoriaService.obtenerCategorias();
  }

  @Get('/nombre/:nombre')
  async obtenerCategoriaNombre(@Param() nombre: string) {
    return await this.categoriaService.obtenerCategoriaNombre(nombre);
  }

  @Post('registrar')
  async agregarCategoria(@Body() body : { nombre: string }) {
    return await this.categoriaService.agregarCategoria(body);
  }
}
