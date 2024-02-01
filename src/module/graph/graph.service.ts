import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateGraphDto } from './dto/create-graph.dto';
import { PointEntity } from './entities/point.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EdgeEntity } from './entities/edge.entity';
import { GraphEntity } from './entities/graph.entity';
import { Graph } from './helpers/handle-graph';
import { LogService } from '../log/log.service';

@Injectable()
export class GraphService {
  constructor(
    @InjectRepository(PointEntity)
    private pointRepository: Repository<PointEntity>,
    @InjectRepository(EdgeEntity)
    private edgeRepository: Repository<EdgeEntity>,
    @InjectRepository(GraphEntity)
    private graphRepository: Repository<GraphEntity>,
    private dataSource: DataSource,
    private logService: LogService,
  ) {}

  // ... [importações e declarações]

  async createGraph(data: CreateGraphDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createGraph = await queryRunner.manager.save(GraphEntity, {
      name: 'Graph Test',
    });
    const pointsToBeCreated: PointEntity[] = [];

    for (const point of data.vertices) {
      // Supondo que 'vertexId' seja um identificador único para cada ponto

      if (!pointsToBeCreated.find((p) => p.id === point.vertexId)) {
        pointsToBeCreated.push({
          id: undefined,
          graph: createGraph,
          location: point.data,
          name: 'default',
        });
      } else {
        throw new ConflictException(
          `Vertex ${point.vertexId} already exists in this graph`,
        );
      }
    }

    const edgesToBeCreated: EdgeEntity[] = [];

    for (const edge of data.edges) {
      if (
        !edgesToBeCreated.find(
          (e) =>
            e.origin.id === edge.originId && e.destiny.id === edge.destinyId,
        )
      ) {
        const originVertex = data.vertices.find(
          (p) => p.vertexId === edge.originId,
        );
        const destinyVertex = data.vertices.find(
          (p) => p.vertexId === edge.destinyId,
        );

        if (!originVertex || !originVertex) {
          throw new BadRequestException(
            'Vertex not found in the vertices array',
          );
        }

        const originPoint: PointEntity = pointsToBeCreated.find(
          (p) => p.location === originVertex.data,
        );

        const destinyPoint: PointEntity = pointsToBeCreated.find(
          (p) => p.location === destinyVertex.data,
        );

        const distance = await this.getDistanceBetweenPoints(
          originVertex.data.coordinates,
          destinyVertex.data.coordinates,
        );

        edgesToBeCreated.push({
          id: undefined,
          name: 'default',
          origin: originPoint,
          destiny: destinyPoint,
          line: {
            type: 'LineString',
            coordinates: [
              originVertex.data.coordinates,
              destinyVertex.data.coordinates,
            ],
          },
          distance: Number(distance),
          graph: createGraph,
        });
      } else {
        throw new BadRequestException(
          `Already exists an edge between
             ${edge.originId} e ${edge.destinyId}`,
        );
      }
    }

    try {
      await queryRunner.manager.save(PointEntity, pointsToBeCreated);
      await queryRunner.manager.save(
        EdgeEntity,
        edgesToBeCreated.map((edge) => {
          return {
            origin: edge.origin,
            destiny: edge.destiny,
            name: edge.name,
            graph: createGraph,
            line: edge.line,
            distance: edge.distance,
          };
        }),
      );
      await queryRunner.commitTransaction();

      await this.logService.logInfo(`Graph ${createGraph.id} created`);

      return this.readGraph(createGraph.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      await this.logService.logError(`Error creating graph: ${error.message}`);

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async readGraph(id: number) {
    try {
      const graph = await this.graphRepository.findOne({
        where: {
          id,
        },
      });
      if (!graph) throw new Error('Graph not found');
      const edges = await this.edgeRepository.find({
        where: {
          graph: { id },
        },
        relations: ['origin', 'destiny'],
      });
      if (!edges) throw new Error('Graph not found');
      const points = await this.pointRepository.find({
        where: {
          graph: { id },
        },
      });
      if (!points) throw new Error('Graph not found');

      return {
        id: graph.id,
        name: graph.name,
        vertices: points.map((point) => {
          return {
            id: point.id,
            name: point.name,
            location: point.location,
          };
        }),
        edges: edges.map((edge) => {
          return {
            id: edge.id,
            name: edge.name,
            origin: {
              id: edge.origin.id,
              location: edge.origin.location,
            },
            destiny: {
              id: edge.destiny.id,
              location: edge.destiny.location,
            },
          };
        }),
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async shortestPath(id: number, originId: number, destinyId: number) {
    try {
      originId = Number(originId);
      destinyId = Number(destinyId);

      const graphPathsExists = await this.verifyPathGraph(
        id,
        originId,
        destinyId,
      );
      if (!graphPathsExists) return;

      const graph = new Graph();

      const edges: any[] = await this.edgeRepository.find({
        where: {
          graph: { id },
        },
        relations: ['origin', 'destiny'],
      });

      const points: any = await this.pointRepository.find({
        where: {
          graph: { id },
        },
      });

      // Adiciona os vértices e arestas ao grafo

      points.map((point) => {
        graph.addVertex(point.id, point.location.coordinates);
      });

      edges.map(async (edge) => {
        graph.addEdge(edge.origin.id, edge.destiny.id, edge.distance);
      });

      // Encontra o melhor caminho

      const shortestPath = graph.findBestPath({
        originId,
        destinyId,
      });

      return shortestPath.map((path) => {
        const newPoint = points.find((point) => point.id === path);
        return {
          id: newPoint.id,
          name: newPoint.name,
          location: newPoint.location,
        };
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async allPaths(
    id: number,
    originId: number,
    destinyId: number,
    limitStop: number,
  ) {
    originId = Number(originId);
    destinyId = Number(destinyId);

    const graphPathsExists = await this.verifyPathGraph(
      id,
      originId,
      destinyId,
    );
    if (!graphPathsExists) return;

    const graph = new Graph();

    const edges: any[] = await this.edgeRepository.find({
      where: {
        graph: { id },
      },
      relations: ['origin', 'destiny'],
    });

    const points: any = await this.pointRepository.find({
      where: {
        graph: { id },
      },
    });

    // Adiciona os vértices e arestas ao grafo

    points.map((point) => {
      graph.addVertex(point.id, point.location.coordinates);
    });

    edges.map((edge) => {
      graph.addEdge(edge.origin.id, edge.destiny.id, edge.distance);
    });

    // Encontra todos os caminhos

    const allPaths = graph.listAllPaths({
      originId,
      destinyId,
    });

    let paths = [];

    if (limitStop) {
      paths = allPaths.filter((path) => path.length <= limitStop + 2);
    } else {
      paths = allPaths;
    }

    // Retorna os caminhos com no máximo 'limitStop' paradas

    return paths.map((path) => {
      return path.map((id) => {
        const newPoint = points.find((point) => point.id === id);
        return {
          id: newPoint.id,
          name: newPoint.name,
          location: newPoint.location,
        };
      });
    });
  }

  async verifyPathGraph(id: number, originId: number, destinyId: number) {
    // Verifica se os pontos existem no grafo

    const originExists = await this.pointRepository.findOne({
      where: {
        id: originId,
        graph: { id },
      },
    });

    const destinyExists = await this.pointRepository.findOne({
      where: {
        id: destinyId,
        graph: { id },
      },
    });

    // Verifica se o grafo existe

    const graphExists = await this.graphRepository.findOne({
      where: {
        id,
      },
    });

    if (!graphExists) throw new BadRequestException('Graph not found');

    if (!originExists || !destinyExists)
      throw new BadRequestException('Invalid origin or destiny');

    return true;
  }

  async deleteGraph(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const graph = await this.graphRepository.findOne({
        where: {
          id,
        },
      });

      if (!graph) throw new BadRequestException('Graph not found');

      await queryRunner.manager.delete(EdgeEntity, {
        graph: { id },
      });

      await queryRunner.manager.delete(PointEntity, {
        graph: { id },
      });

      await queryRunner.manager.delete(GraphEntity, {
        id,
      });

      await queryRunner.commitTransaction();

      await this.logService.logInfo(`The graph ${id} was deleted`);

      return {
        message: 'Graph deleted',
      };
    } catch (error) {
      await this.logService.logError(`Error deleting graph: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async getDistanceBetweenPoints(
    originCoordinates: number[],
    destinyCoordinates: number[],
  ): Promise<number> {
    const distance = await this.dataSource.query(
      `SELECT ST_Distance(ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography) AS distance;`,
      [
        originCoordinates[0],
        originCoordinates[1],
        destinyCoordinates[0],
        destinyCoordinates[1],
      ],
    );

    return distance[0].distance;
  }
}
