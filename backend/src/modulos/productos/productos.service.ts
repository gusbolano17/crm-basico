import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../../entities/producto.entity';
import { ProductoDTO } from '../../entities/dto/productoDTO';
import { Repository } from 'typeorm';
import { CategoriaService } from '../categoria/categoria.service';
import { FiltroProductoDto } from '../../entities/dto/filtro-cliente-dto';
import { UpdateProductoDto } from '../../entities/dto/update-producto-dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private productosRepository: Repository<ProductoEntity>,
    private categoriaService: CategoriaService,
  ) {}

  async agregarProducto(producto : ProductoDTO) : Promise<ProductoEntity> {

    const productoExist = await this.productosRepository.findOne({
      where: { nombre: producto.nombre },
    });

    if (productoExist) throw new Error('El producto ya existe');

    const categoria = await this.categoriaService.obtenerCategoriaNombre(producto.categoria);
    if (!categoria) throw new Error('La categoria no existe');

    const nuevoProducto = this.productosRepository.create({
      ...producto,
      categoria: categoria,
      creado: new Date(),
      actualizado: new Date(),
    });

    return await this.productosRepository.save(nuevoProducto);

  }

  async modificarStock(productoId: string, cantidad: number) : Promise<void> {
    const producto = await this.productosRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) throw new Error('El producto no existe');
    producto.stock = cantidad;
    await this.productosRepository.save(producto);
  }

  async listarProductos() : Promise<ProductoEntity[]> {
    return await this.productosRepository.find();
  }

  async obtenerProductoNombre(prod: string) {
    return await this.productosRepository.findOne({
      where: { nombre: prod },
    });
  }

  async filtrarProductos(filtros : FiltroProductoDto){
    const {
      search,
      categoria,
      desde,
      hasta,
      page = '1',
      limit = '10',
      sort = 'creado',
      dir = 'desc'
    } = filtros;

    const qb = this.productosRepository.createQueryBuilder('producto')
      .innerJoinAndSelect('producto.categoria', 'categoria');

    if (search){
      qb.andWhere(
        '(LOWER(producto.nombre) LIKE :s OR LOWER(producto.descripcion) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    if (categoria && categoria !== 'Todos') qb.andWhere('producto.categoria = :categoria', { categoria });

    if (desde) qb.andWhere('producto.creado >= :desde', { desde: new Date(desde) });
    if (hasta) qb.andWhere('producto.creado <= :hasta', { hasta: new Date(hasta) });

    qb.orderBy(`producto.${sort}`, dir.toUpperCase() as 'ASC' | 'DESC');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    qb.skip(skip).take(parseInt(limit));

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(total / +limit),
    };
  }

  async actualizarProducto(id : string, producto : UpdateProductoDto) : Promise<ProductoEntity> {
    const productoExist = await this.productosRepository.findOne({
      where: { id },
    });
    if (!productoExist) throw new Error('El producto no existe');

    let categoria;
    if (producto.categoria) {
      categoria = await this.categoriaService.obtenerCategoriaNombre(producto.categoria);
      if (!categoria) throw new Error('La categoria no existe');
    }else{
      throw new Error('No especificaste categoria');
    }

    return await this.productosRepository.save({
      ...productoExist,
      ...producto,
      categoria,
      actualizado : new Date()
    })
  }

  async eliminarProducto(id : string) : Promise<void> {
    const productoExist = await this.productosRepository.findOne({
      where: { id },
    });
    if (!productoExist) throw new Error('El producto no existe');
    await this.productosRepository.delete(productoExist.id);
  }
}
