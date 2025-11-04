import { PartialType } from '@nestjs/mapped-types';
import { ProductoDTO } from './productoDTO';


export class UpdateProductoDto extends PartialType(ProductoDTO){}