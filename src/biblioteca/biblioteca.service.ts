import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
  ) {}

  async findAll(): Promise<BibliotecaEntity[]> {
    return this.bibliotecaRepository.find();
  }

  async findOne(id: string): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${id} no fue encontrada`);
    }
    return biblioteca;
  }

  async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    if (biblioteca.horaApertura >= biblioteca.horaCierre) {
      throw new BadRequestException('La hora de apertura debe ser menor a la hora de cierre');
    }
    return this.bibliotecaRepository.save(biblioteca);
  }

  async update(id: string, biblioteca: Partial<BibliotecaEntity>): Promise<BibliotecaEntity> {
    const existingBiblioteca = await this.findOne(id);

    if (
        biblioteca.horaApertura &&
        biblioteca.horaCierre &&
        new Date(biblioteca.horaApertura) >= new Date(biblioteca.horaCierre)
    ) {
        throw new BadRequestException('La hora de apertura debe ser menor a la hora de cierre');
    }

    const updatedBiblioteca = Object.assign(existingBiblioteca, biblioteca);
    return this.bibliotecaRepository.save(updatedBiblioteca);
}

  async delete(id: string): Promise<void> {
    const biblioteca = await this.findOne(id);
    await this.bibliotecaRepository.remove(biblioteca);
  }
}