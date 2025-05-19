import { Controller, Post, Get, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LibroBibliotecaService } from './libro-biblioteca.service';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';

@Controller('libraries/:bibliotecaId/books')
export class LibroBibliotecaController {
  constructor(private readonly libroBibliotecaService: LibroBibliotecaService) {}

  @Post(':libroId')
  @HttpCode(HttpStatus.CREATED)
  async addBookToLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ): Promise<BibliotecaEntity> {
    return this.libroBibliotecaService.addBookToLibrary(bibliotecaId, libroId);
  }

  @Get()
  async findBooksFromLibrary(@Param('bibliotecaId') bibliotecaId: string): Promise<LibroEntity[]> {
    return this.libroBibliotecaService.findBooksFromLibrary(bibliotecaId);
  }

  @Get(':libroId')
  async findBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ): Promise<LibroEntity> {
    return this.libroBibliotecaService.findBookFromLibrary(bibliotecaId, libroId);
  }

  @Put()
  async updateBooksFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Body('librosIds') librosIds: string[],
  ): Promise<BibliotecaEntity> {
    return this.libroBibliotecaService.updateBooksFromLibrary(bibliotecaId, librosIds);
  }

  @Delete(':libroId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBookFromLibrary(
    @Param('bibliotecaId') bibliotecaId: string,
    @Param('libroId') libroId: string,
  ): Promise<void> {
    return this.libroBibliotecaService.deleteBookFromLibrary(bibliotecaId, libroId);
  }
}