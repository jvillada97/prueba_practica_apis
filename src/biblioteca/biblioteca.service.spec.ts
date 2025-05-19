import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let repository: Repository<BibliotecaEntity>;

  const mockBiblioteca: BibliotecaEntity = {
    id: '1',
    nombre: 'Biblioteca Central',
    direccion: 'Calle 123',
    ciudad: 'Ciudad Ejemplo',
    horaApertura: new Date('2025-05-18T08:00:00'),
    horaCierre: new Date('2025-05-18T18:00:00'),
    libros: [],
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockBiblioteca]),
    findOne: jest.fn().mockResolvedValue(mockBiblioteca),
    save: jest.fn().mockResolvedValue(mockBiblioteca),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibliotecaService,
        {
          provide: getRepositoryToken(BibliotecaEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
    repository = module.get<Repository<BibliotecaEntity>>(getRepositoryToken(BibliotecaEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bibliotecas', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockBiblioteca]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a biblioteca by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockBiblioteca);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if biblioteca is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new biblioteca', async () => {
      const result = await service.create(mockBiblioteca);
      expect(result).toEqual(mockBiblioteca);
      expect(repository.save).toHaveBeenCalledWith(mockBiblioteca);
    });

    it('should throw BadRequestException if horaApertura is greater than or equal to horaCierre', async () => {
      const invalidBiblioteca = {
        ...mockBiblioteca,
        horaApertura: new Date('2025-05-18T18:00:00'),
        horaCierre: new Date('2025-05-18T18:00:00'),
      };
      await expect(service.create(invalidBiblioteca)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing biblioteca', async () => {
      const updatedData = { nombre: 'Biblioteca Actualizada' };
      const result = await service.update('1', updatedData);
      expect(result).toEqual(mockBiblioteca);
      expect(repository.save).toHaveBeenCalledWith({ ...mockBiblioteca, ...updatedData });
    });

    it('should throw BadRequestException if horaApertura is greater than or equal to horaCierre', async () => {
      const invalidUpdate = {
        horaApertura: new Date('2025-05-18T18:00:00'),
        horaCierre: new Date('2025-05-18T18:00:00'),
      };
      await expect(service.update('1', invalidUpdate)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if biblioteca is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(service.update('2', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a biblioteca', async () => {
      const result = await service.delete('1');
      expect(result).toBeUndefined();
      expect(repository.remove).toHaveBeenCalledWith(mockBiblioteca);
    });

    it('should throw NotFoundException if biblioteca is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(service.delete('2')).rejects.toThrow(NotFoundException);
    });
  });
});
