import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GeoJsonObject, Position } from 'geojson';
import { ApiProperty } from '@nestjs/swagger';

class PointGeoJSON implements GeoJsonObject {
  @IsString()
  @IsNotEmpty()
  type: 'Point';

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: Position;
}

export class VertexDTO {
  @IsNumber()
  vertexId: number;

  @IsObject()
  @ValidateNested()
  @Type(() => PointGeoJSON)
  data: PointGeoJSON;
}

export class EdgeDTO {
  @IsNumber()
  originId: number;

  @IsNumber()
  destinyId: number;
}

export class CreateGraphDto {
  @ApiProperty({ example: 'Grafo triangular' })
  @IsString()
  name: string;

  @ApiProperty({
    example: [
      {
        vertexId: 1,
        data: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      {
        vertexId: 2,
        data: {
          type: 'Point',
          coordinates: [1, 1],
        },
      },
      {
        vertexId: 3,
        data: {
          type: 'Point',
          coordinates: [2, 2],
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VertexDTO)
  vertices: VertexDTO[];

  @ApiProperty({
    example: [
      {
        originId: 1,
        destinyId: 2,
      },
      {
        originId: 2,
        destinyId: 3,
      },
      {
        originId: 3,
        destinyId: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDTO)
  edges: EdgeDTO[];
}
