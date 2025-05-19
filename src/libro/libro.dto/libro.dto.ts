import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class BibliotecaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;

  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;

  @IsDate()
  @IsNotEmpty()
  readonly horaApertura: Date;

  @IsDate()
  @IsNotEmpty()
  readonly horaCierre: Date;
}