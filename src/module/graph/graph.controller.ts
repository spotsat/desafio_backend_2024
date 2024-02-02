import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto';
import { GraphService } from './graph.service';
import { ParamId } from '../../decorators/param-id.decorator';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { LogInterceptor } from '../../interceptors/log.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGraphResponseDto } from './dto/create-graph-response.dto';

@ApiTags('graph')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @ApiOperation({
    summary: 'Criar um novo grafo',
    description:
      'Para criar um grafo, é necessário informar os vértices, utilizando pontos geográficos no formato GEOJSON, bem como as arestas. Cada aresta deve receber um ID de origem e um ID de destino, referenciando os pontos previamente informados. Troque os valores "0" do esquema por números naturais. (Apenas Adminiistradores podem criar um grafo.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna o grafo criado',
    type: CreateGraphResponseDto,
  })
  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateGraphDto) {
    try {
      return this.graphService.createGraph(data);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: 'Listar grafos',
    description:
      'Lista um grafo específico, informando o ID do grafo. (Adminiistradores e usuários podem listar um grafo.)',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID do grafo' })
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async read(@ParamId() id: number) {
    try {
      if (!id || isNaN(id) || id < 0)
        throw new BadRequestException('Id inválido');
      return this.graphService.readGraph(id);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  @ApiOperation({
    summary: 'Buscar menor caminho',
    description:
      'Busca o menor caminho entre dois pontos informados, para obter os Ids dos pontos desse grafo, consulte a rota GET /graph/:id (Administradores e Usuários podem buscar o menor caminho.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna um array com pontos no formato GEOJSON',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do grafo',
    example: 1,
  })
  @ApiQuery({
    name: 'originId',
    type: Number,
    description: 'ID do ponto de origem',
    example: 1,
  })
  @ApiQuery({
    name: 'destinyId',
    type: Number,
    description: 'ID do ponto de destino',
    example: 3,
  })
  @Roles(Role.Admin, Role.User)
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

  @ApiOperation({
    summary: 'Listar todos os caminhos',
    description:
      'Lista todos os caminhos entre dois pontos informados. (Administradores e Usuários podem listar todos os caminhos.)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do grafo',
    example: 1,
  })
  @ApiQuery({
    name: 'originId',
    type: Number,
    description: 'ID do ponto de origem',
    example: 1,
  })
  @ApiQuery({
    name: 'destinyId',
    type: Number,
    description: 'ID do ponto de destino',
    example: 3,
  })
  @ApiQuery({
    name: 'limitStop',
    type: Number,
    description: 'Limite de paradas',
    example: 1,
    required: false,
  })
  @Roles(Role.Admin, Role.User)
  @Get(':id/all-paths')
  async listAllPaths(
    @ParamId('id') id: number,
    @Query('originId') originId: number,
    @Query('destinyId') destinyId: number,
    @Query('limitStop') limitStop?: number,
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

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@ParamId() id: number) {
    try {
      return this.graphService.deleteGraph(id);
    } catch (error) {
      throw error;
    }
  }
}
