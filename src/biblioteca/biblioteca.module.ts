import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity])], 
  controllers: [BibliotecaController],
  providers: [BibliotecaService],
  exports: [BibliotecaService], 
})
export class BibliotecaModule {}