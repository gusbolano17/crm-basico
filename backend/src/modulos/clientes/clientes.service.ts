import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from '../../entities/dto/create-cliente.dto';
import { UpdateClienteDto } from '../../entities/dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteEntity } from '../../entities/cliente.entity';
import { FiltroClienteDto } from '../../entities/dto/filtro-cliente-dto';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(ClienteEntity)
    private clientesRepository: Repository<ClienteEntity>,
  ) {}

  async registrarClientes(createClienteDto: CreateClienteDto) : Promise<ClienteEntity> {
    const existClient = await this.clientesRepository.findOne({
      where: { documento: createClienteDto.documento },
    });

    if (existClient) throw new Error('El cliente ya existe');

    const cliente = await this.clientesRepository.create({
      ...createClienteDto,
      creado: new Date(),
      actualizado: new Date(),
    });

    return await this.clientesRepository.save(cliente);
  }

  async listarClientes() : Promise<ClienteEntity[]> {
    return await this.clientesRepository.find();
  }

  async obtenerCLienteDoc(clienteId: string) {
    return await this.clientesRepository.findOne({
      where: { documento: clienteId },
    });
  }

  async filtrarClientes(filtros: FiltroClienteDto){
    const {
      search,
      tipoDocumento,
      documento,
      desde,
      hasta,
      page = '1',
      limit = '10',
      sort = 'creado',
      dir = 'desc'
    } = filtros;

    const qb = this.clientesRepository.createQueryBuilder('cliente');

    if (search){
      qb.andWhere(
        '(LOWER(cliente.nombre) LIKE :s OR LOWER(cliente.apellido) LIKE :s OR cliente.documento LIKE :s OR LOWER(cliente.email) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    if (tipoDocumento && documento) qb.andWhere('cliente.tipoDocumento = :tipoDocumento AND cliente.documento =:documento', { tipoDocumento , documento });

    if (desde) qb.andWhere('cliente.creado >= :desde', { desde: new Date(desde) });
    if (hasta) qb.andWhere('cliente.creado <= :hasta', { hasta: new Date(hasta) });

    qb.orderBy(`cliente.${sort}`, dir.toUpperCase() as 'ASC' | 'DESC');

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


  async actualizarCliente(id: string, updateClienteDto: UpdateClienteDto) : Promise<ClienteEntity> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
    });

    if (!cliente) throw new Error('El cliente no existe');

    return await this.clientesRepository.save({
      ...cliente,
      ...updateClienteDto,
      actualizado: new Date(),
    });
  }


  async eliminarCliente(id: string) : Promise<void> {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
    });
    if (!cliente) throw new Error('El cliente no existe');
    await this.clientesRepository.delete(cliente.id);
  }

}
