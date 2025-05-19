import { Test, TestingModule } from '@nestjs/testing';
import { LibroBibliotecaService } from './libro-biblioteca.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('LibroBibliotecaService', () => {
  let service: LibroBibliotecaService;
  let bibliotecaRepository: Repository<BibliotecaEntity>;
  let libroRepository: Repository<LibroEntity>;

  const mockBiblioteca: BibliotecaEntity = {
    id: '1',
    nombre: 'Biblioteca Central',
    direccion: 'Calle 123',
    ciudad: 'Ciudad Ejemplo',
    horaApertura: new Date('2025-05-18T08:00:00'),
    horaCierre: new Date('2025-05-18T18:00:00'),
    libros: [],
  };

  const mockLibro: LibroEntity = {
    id: '1',
    titulo: 'Libro Ejemplo',
    autor: 'Autor Ejemplo',
    fechaPublicacion: '2025-05-17',
    isbn: '978-3-16-148410-0', // propiedad requerida agregada
    bibliotecas: [],
  };

  const mockBibliotecaRepository = {
    findOne: jest.fn().mockResolvedValue(mockBiblioteca),
    save: jest.fn().mockResolvedValue(mockBiblioteca),
  };

  const mockLibroRepository = {
    findOne: jest.fn().mockResolvedValue(mockLibro),
    findByIds: jest.fn().mockResolvedValue([mockLibro]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroBibliotecaService,
        {
          provide: getRepositoryToken(BibliotecaEntity),
          useValue: mockBibliotecaRepository,
        },
        {
          provide: getRepositoryToken(LibroEntity),
          useValue: mockLibroRepository,
        },
      ],
    }).compile();

    service = module.get<LibroBibliotecaService>(LibroBibliotecaService);
    bibliotecaRepository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
    libroRepository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addBookToLibrary', () => {
    it('should add a book to a library', async () => {
      const result = await service.addBookToLibrary('1', '1');
      expect(result).toEqual(mockBiblioteca);
      expect(bibliotecaRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['libros'] });
      expect(libroRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(bibliotecaRepository.save).toHaveBeenCalledWith(mockBiblioteca);
    });

    it('should throw NotFoundException if the library is not found', async () => {
      jest.spyOn(bibliotecaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.addBookToLibrary('2', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the book is not found', async () => {
      jest.spyOn(libroRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.addBookToLibrary('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBooksFromLibrary', () => {
    it('should return all books from a library', async () => {
      const result = await service.findBooksFromLibrary('1');
      expect(result).toEqual(mockBiblioteca.libros);
      expect(bibliotecaRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['libros'] });
    });

    it('should throw NotFoundException if the library is not found', async () => {
      jest.spyOn(bibliotecaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findBooksFromLibrary('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBookFromLibrary', () => {
    it('should return a specific book from a library', async () => {
      mockBiblioteca.libros.push(mockLibro);
      const result = await service.findBookFromLibrary('1', '1');
      expect(result).toEqual(mockLibro);
    });

    it('should throw NotFoundException if the library is not found', async () => {
      jest.spyOn(bibliotecaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findBookFromLibrary('2', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the book is not associated with the library', async () => {
      await expect(service.findBookFromLibrary('1', '2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBooksFromLibrary', () => {
    it('should update books associated with a library', async () => {
      const result = await service.updateBooksFromLibrary('1', ['1']);
      expect(result).toEqual(mockBiblioteca);
      expect(libroRepository.findByIds).toHaveBeenCalledWith(['1']);
      expect(bibliotecaRepository.save).toHaveBeenCalledWith(mockBiblioteca);
    });

    it('should throw NotFoundException if the library is not found', async () => {
      jest.spyOn(bibliotecaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.updateBooksFromLibrary('2', ['1'])).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if some books are not found', async () => {
      jest.spyOn(libroRepository, 'findByIds').mockResolvedValueOnce([]);
      await expect(service.updateBooksFromLibrary('1', ['2'])).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBookFromLibrary', () => {
    it('should delete a book from a library', async () => {
      mockBiblioteca.libros.push(mockLibro);
      await service.deleteBookFromLibrary('1', '1');
      expect(bibliotecaRepository.save).toHaveBeenCalledWith(mockBiblioteca);
    });

    it('should throw NotFoundException if the library is not found', async () => {
      jest.spyOn(bibliotecaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.deleteBookFromLibrary('2', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the book is not associated with the library', async () => {
      await expect(service.deleteBookFromLibrary('1', '2')).rejects.toThrow(NotFoundException);
    });
  });
});
