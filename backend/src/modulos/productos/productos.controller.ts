import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductoEntity } from '../../entities/producto.entity';
import { ProductoDTO } from '../../entities/dto/productoDTO';
import { FiltroProductoDto } from '../../entities/dto/filtro-cliente-dto';
import { UpdateProductoDto } from '../../entities/dto/update-producto-dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post("agregar")
  async agregarProducto(@Body() producto : ProductoDTO) : Promise<ProductoEntity>{
    return await this.productosService.agregarProducto(producto);
  }

  @Get("listar")
  async listarProductos() : Promise<ProductoEntity[]>{
    return await this.productosService.listarProductos();
  }

  @Get("filtrar")
  async filtrarProductos(@Query() filtro : FiltroProductoDto){
    return await this.productosService.filtrarProductos(filtro);
  }

  @Put("actualizar/:id")
  async actualizarProducto(@Param('id') id : string, @Body() producto : UpdateProductoDto) : Promise<ProductoEntity>{
    return await this.productosService.actualizarProducto(id, producto);
  }

  @Delete("eliminar/:id")
  async eliminarProducto(@Param('id') id : string) : Promise<void>{
    return await this.productosService.eliminarProducto(id);
  }
}
