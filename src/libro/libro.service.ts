import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity/libro.entity';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async findAll(): Promise<LibroEntity[]> {
    return this.libroRepository.find();
  }

  async findOne(id: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({ where: { id } });
    if (!libro) {
      throw new NotFoundException(`El libro con id ${id} no fue encontrado`);
    }
    return libro;
  }

  async create(libro: LibroEntity): Promise<LibroEntity> {
    if (new Date(libro.fechaPublicacion) > new Date()) {
      throw new BadRequestException('La fecha de publicación no puede ser posterior a la fecha actual');
    }
    return this.libroRepository.save(libro);
  }

  async update(id: string, libro: Partial<LibroEntity>): Promise<LibroEntity> {
    const existingLibro = await this.findOne(id);

    if (libro.fechaPublicacion && new Date(libro.fechaPublicacion) > new Date()) {
      throw new BadRequestException('La fecha de publicación no puede ser posterior a la fecha actual');
    }

    const updatedLibro = Object.assign(existingLibro, libro);
    return this.libroRepository.save(updatedLibro);
  }

  async delete(id: string): Promise<void> {
    const libro = await this.findOne(id);
    await this.libroRepository.remove(libro);
  }
}