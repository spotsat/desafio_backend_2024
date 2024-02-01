import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Geometry } from 'typeorm';
import { GeometryDTO } from './geometry.dto';

class ResponseVertexDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: GeometryDTO })
  location: Geometry;
}

class ResponseEdgeDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: () => ResponseVertexDTO })
  origin: ResponseVertexDTO;

  @ApiProperty({ type: () => ResponseVertexDTO })
  destiny: ResponseVertexDTO;
}

export class CreateGraphResponseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Grafo triangular' })
  @IsString()
  name: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      {
        id: 2,
        location: {
          type: 'Point',
          coordinates: [1, 1],
        },
      },
      {
        id: 3,
        location: {
          type: 'Point',
          coordinates: [2, 2],
        },
      },
    ],
  })
  vertices: ResponseVertexDTO[];

  @ApiProperty({
    example: [
      {
        id: 1,
        origin: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        destiny: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
      },
      {
        id: 2,
        origin: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
        destiny: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
      },
      {
        id: 3,
        origin: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
        destiny: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      },
    ],
  })
  edges: ResponseEdgeDTO[];
}
