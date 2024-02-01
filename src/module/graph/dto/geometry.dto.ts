import { ApiProperty } from '@nestjs/swagger';

export class GeometryDTO {
  @ApiProperty({ example: 'Point', description: 'Tipo de geometria' })
  type: string;

  @ApiProperty({
    example: [40.7128, -74.006],
    description: 'Coordenadas da geometria',
  })
  coordinates: number[];
}
