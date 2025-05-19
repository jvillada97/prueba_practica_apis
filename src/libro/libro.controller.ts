import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroEntity } from './libro.entity/libro.entity';

@Controller('books')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  async findAll(): Promise<LibroEntity[]> {
    return this.libroService.findAll();
  }

  @Get(':libroId')
  async findOne(@Param('libroId') id: string): Promise<LibroEntity> {
    return this.libroService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() libro: LibroEntity): Promise<LibroEntity> {
    return this.libroService.create(libro);
  }

  @Put(':libroId')
  async update(
    @Param('libroId') id: string,
    @Body() libro: Partial<LibroEntity>,
  ): Promise<LibroEntity> {
    return this.libroService.update(id, libro);
  }

  @Delete(':libroId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('libroId') id: string): Promise<void> {
    return this.libroService.delete(id);
  }
}