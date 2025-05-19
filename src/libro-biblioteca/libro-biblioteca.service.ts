import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';

@Injectable()
export class LibroBibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${bibliotecaId} no fue encontrada`);
    }

    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro) {
      throw new NotFoundException(`El libro con id ${libroId} no fue encontrado`);
    }

    biblioteca.libros.push(libro);
    return this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${bibliotecaId} no fue encontrada`);
    }
    return biblioteca.libros;
  }

  async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${bibliotecaId} no fue encontrada`);
    }

    const libro = biblioteca.libros.find((libro) => libro.id === libroId);
    if (!libro) {
      throw new NotFoundException(`El libro con id ${libroId} no está asociado a la biblioteca con id ${bibliotecaId}`);
    }

    return libro;
  }

  async updateBooksFromLibrary(bibliotecaId: string, librosIds: string[]): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${bibliotecaId} no fue encontrada`);
    }

    const libros = await this.libroRepository.findByIds(librosIds);
    if (libros.length !== librosIds.length) {
      throw new NotFoundException('Algunos libros no fueron encontrados');
    }

    biblioteca.libros = libros;
    return this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(bibliotecaId: string, libroId: string): Promise<void> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca) {
      throw new NotFoundException(`La biblioteca con id ${bibliotecaId} no fue encontrada`);
    }

    const libroIndex = biblioteca.libros.findIndex((libro) => libro.id === libroId);
    if (libroIndex === -1) {
      throw new NotFoundException(`El libro con id ${libroId} no está asociado a la biblioteca con id ${bibliotecaId}`);
    }

    biblioteca.libros.splice(libroIndex, 1);
    await this.bibliotecaRepository.save(biblioteca);
  }
}