import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../../entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async agregarCategoria(body : { nombre: string }) : Promise<Categoria> {

    const { nombre } = body;
    const existCategoria = await this.categoriaRepository.findOne({
      where: { nombre },
    });
    if (existCategoria) throw new Error('La categoria ya existe');

    const categoria = await this.categoriaRepository.create(body);

    return await this.categoriaRepository.save(categoria);
  }

  async obtenerCategorias() : Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async obtenerCategoriaNombre(nombre: string) : Promise<Categoria | null> {

    try {
      return await this.categoriaRepository.findOne({
        where: { nombre },
      });
    }catch{
      throw new Error('Error al obtener la categoria');
    }
  }
}
