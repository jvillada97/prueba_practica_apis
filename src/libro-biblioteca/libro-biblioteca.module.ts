import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroBibliotecaService } from './libro-biblioteca.service';
import { LibroBibliotecaController } from './libro-biblioteca.controller';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BibliotecaModule } from '../biblioteca/biblioteca.module';
import { LibroModule } from '../libro/libro.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BibliotecaEntity, LibroEntity]), 
    BibliotecaModule, 
    LibroModule, 
  ],
  providers: [LibroBibliotecaService],
  controllers: [LibroBibliotecaController],
})
export class LibroBibliotecaModule {}