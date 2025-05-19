import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LibroEntity } from './libro.entity/libro.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LibroService', () => {
  let service: LibroService;
  let repository: Repository<LibroEntity>;

  const mockLibro: LibroEntity = {
    id: '1',
    titulo: 'Libro Ejemplo',
    autor: 'Autor Ejemplo',
    fechaPublicacion: '2023-05-17',
    isbn: '1234567890',
    bibliotecas: [],
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockLibro]),
    findOne: jest.fn().mockResolvedValue(mockLibro),
    save: jest.fn().mockResolvedValue(mockLibro),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroService,
        {
          provide: getRepositoryToken(LibroEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repository = module.get<Repository<LibroEntity>>(getRepositoryToken(LibroEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of libros', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockLibro]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a libro by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockLibro);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if libro is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new libro', async () => {
      const result = await service.create(mockLibro);
      expect(result).toEqual(mockLibro);
      expect(repository.save).toHaveBeenCalledWith(mockLibro);
    });

    it('should throw BadRequestException if fechaPublicacion is in the future', async () => {
      const invalidLibro: LibroEntity = {
        ...mockLibro,
        fechaPublicacion: '2999-01-01',
      };
      await expect(service.create(invalidLibro)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing libro', async () => {
      const updatedData = { titulo: 'Libro Actualizado' };
      const result = await service.update('1', updatedData);
      expect(result).toEqual(mockLibro);
      expect(repository.save).toHaveBeenCalledWith({ ...mockLibro, ...updatedData });
    });

    it('should throw BadRequestException if fechaPublicacion is in the future', async () => {
      const invalidUpdate = { fechaPublicacion: '2999-01-01' };
      await expect(service.update('1', invalidUpdate)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if libro is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(service.update('2', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a libro', async () => {
      const result = await service.delete('1');
      expect(result).toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(mockLibro);
    });

    it('should throw NotFoundException if libro is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(service.delete('2')).rejects.toThrow(NotFoundException);
    });
  });
});
