import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto';
import { GraphService } from './graph.service';
import { ParamId } from '../../decorators/param-id.decorator';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post()
  async create(@Body() data: CreateGraphDto) {
    try {
      return this.graphService.createGraph(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @Get(':id')
  async read(@ParamId() id: number) {
    try {
      if (!id || isNaN(id) || id < 0)
        throw new BadRequestException('Invalid id');
      return this.graphService.readGraph(id);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @Get(':id/shortest-path')
  async readShortestPath(
    @ParamId() id: number,
    @Query('originId') originId: number,
    @Query('destinyId') destinyId: number,
  ) {
    try {
      return this.graphService.shortestPath(Number(id), originId, destinyId);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @Get(':id/all-paths')
  async listAllPaths(
    @ParamId('id') id: number,
    @Query('originId') originId: number,
    @Query('destinyId') destinyId: number,
    @Query('limitStop') limitStop: number,
  ) {
    try {
      if (!id || isNaN(id) || id < 0) {
        throw new BadRequestException('Invalid id');
      }

      if (!originId || isNaN(originId) || originId < 0) {
        throw new BadRequestException('Invalid originId');
      }

      if (!destinyId || isNaN(destinyId) || destinyId < 0) {
        throw new BadRequestException('Invalid destinyId');
      }

      return await this.graphService.allPaths(
        Number(id),
        Number(originId),
        Number(destinyId),
        Number(limitStop),
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async delete(@ParamId() id: number) {
    try {
      return this.graphService.deleteGraph(id);
    } catch (error) {
      throw error;
    }
  }
}
