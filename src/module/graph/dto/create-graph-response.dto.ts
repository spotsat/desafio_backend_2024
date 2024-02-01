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
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [ResponseVertexDTO] })
  vertices: ResponseVertexDTO[];

  @ApiProperty({ type: [ResponseEdgeDTO] })
  edges: ResponseEdgeDTO[];
}
