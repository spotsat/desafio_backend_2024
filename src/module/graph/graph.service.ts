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
  ) {}

  // ... [importações e declarações]

  async createGraph(data: CreateGraphDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createGraph = await queryRunner.manager.save(GraphEntity, {
      name: 'myGraph',
    });
    const pointsToBeCreated: PointEntity[] = [];

    for (const point of data.vertices) {
      // Supondo que 'vertexId' seja um identificador único para cada ponto

      if (!pointsToBeCreated.find((p) => p.id === point.vertexId)) {
        pointsToBeCreated.push({
          id: point.vertexId,
          graphId: createGraph.id,
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
          (e) => e.originId === edge.originId && e.destinyId === edge.destinyId,
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

        edgesToBeCreated.push({
          id: undefined,
          name: 'default',
          originId: edge.originId,
          destinyId: edge.destinyId,
          line: {
            type: 'LineString',
            coordinates: [
              originVertex.data.coordinates,
              destinyVertex.data.coordinates,
            ],
          },
          graphId: createGraph.id,
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
            originId: edge.originId,
            destinyId: edge.destinyId,
            name: edge.name,
            graphId: createGraph.id,
            line: edge.line,
          };
        }),
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async readGraph(id: number) {
    try {
      const res = await this.edgeRepository.find({
        where: {
          graphId: id,
        },
        relations: ['originId', 'destinyId'],
        select: ['id', 'name', 'originId', 'destinyId'],
      });
      if (!res) throw new Error('Graph not found');

      return res;
    } catch (error) {
      throw new Error('Error while reading graph');
    }
  }

  async shortestPath(id: number, originId: number, destinyId: number) {
    const graph = new Graph();
    originId = Number(originId);
    destinyId = Number(destinyId);

    const edges: any[] = await this.edgeRepository.find({
      where: {
        graphId: id,
      },
      relations: ['originId', 'destinyId'],
    });

    const points: any = await this.pointRepository.find({
      where: {
        graphId: id,
      },
    });

    points.map((point) => {
      graph.addVertex(point.id, point.location.coordinates);
    });

    edges.map((edge) => {
      const edgeLenght = edge.line.coordinates.reduce((acc, curr, index) => {
        if (index === 0) return acc;
        const [x1, y1] = edge.line.coordinates[index - 1];
        const [x2, y2] = curr;
        const x = x2 - x1;
        const y = y2 - y1;
        return acc + Math.sqrt(x * x + y * y);
      }, 0);

      graph.addEdge(edge.originId.id, edge.destinyId.id, edgeLenght);
    });
    console.log('originId', originId);
    console.log('destinyId', destinyId);
    const bestPath = graph.findBestPath({
      originId,
      destinyId,
    });
    console.log(bestPath);
    console.log(points);

    return bestPath.map((path) => {
      const newPoint = points.find((point) => point.id === path);
      return {
        id: newPoint.id,
        name: newPoint.name,
        location: newPoint.location,
      };
    });
  }
}
// const result = await this.pointRepository.manager.query(
//   `INSERT INTO points (name, location) VALUES ('default',ST_SetSRID(ST_GeomFromGeoJSON($1), 4326))`,
//   [point],
// );
