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
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VertexDTO)
  vertices: VertexDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDTO)
  edges: EdgeDTO[];
}
