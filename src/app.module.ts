import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { LibroModule } from './libro/libro.module';
import { LibroBibliotecaModule } from './libro-biblioteca/libro-biblioteca.module';
import { BibliotecaEntity } from './biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from './libro/libro.entity/libro.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'bibliotecas',
      entities: [BibliotecaEntity, LibroEntity],
      dropSchema: true,
      synchronize: true 
    }),
    LibroBibliotecaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}