import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';

@Controller('libraries')
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  async findAll(): Promise<BibliotecaEntity[]> {
    return this.bibliotecaService.findAll();
  }

  @Get(':bibliotecaId')
  async findOne(@Param('bibliotecaId') id: string): Promise<BibliotecaEntity> {
    return this.bibliotecaService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    return this.bibliotecaService.create(biblioteca);
  }

  @Put(':bibliotecaId')
  async update(
    @Param('bibliotecaId') id: string,
    @Body() biblioteca: Partial<BibliotecaEntity>,
  ): Promise<BibliotecaEntity> {
    return this.bibliotecaService.update(id, biblioteca);
  }

  @Delete(':bibliotecaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('bibliotecaId') id: string): Promise<void> {
    return this.bibliotecaService.delete(id);
  }
}