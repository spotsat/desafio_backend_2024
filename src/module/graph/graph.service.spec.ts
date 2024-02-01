import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';
import { graphRepositoryMock } from '../../testing/graph/graph-repository.mock';
import { edgeRepositoryMock } from '../../testing/graph/edge-repository.mock';
import { pointRepositoryMock } from '../../testing/graph/point-repository.mock';
import { dataSourceMock } from '../../testing/datasource/datasource.mock';
import { createGraphDtoMock } from '../../testing/graph/create-graph-dto.mock';
import { graphEntityList } from '../../testing/graph/create-graph-entity-list';
import { allPathsMock } from '../../testing/graph/all-paths.mock';
import { shortestPathMock } from '../../testing/graph/shortest-path.mock';
import { logServiceMock } from '../../testing/log/log.service.mock';

describe('GraphService', () => {
  let graphService: GraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        graphRepositoryMock,
        edgeRepositoryMock,
        pointRepositoryMock,
        dataSourceMock,
        logServiceMock,
      ],
    }).compile();

    graphService = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(graphService).toBeDefined();
  });

  it('should create a graph', async () => {
    const graph = await graphService.createGraph(createGraphDtoMock);
    expect(graph).toBeDefined();
    expect(graph).toStrictEqual(graphEntityList[0]);
  });

  it('should read a graph', async () => {
    const graph = await graphService.readGraph(1);
    expect(graph).toBeDefined();
    expect(graph).toStrictEqual(graphEntityList[0]);
  });

  it('should find all graphs', async () => {
    const test1 = await graphService.allPaths(1, 1, 4, 0);
    expect(test1).toBeDefined();
    expect(test1).toStrictEqual(allPathsMock);

    // Teste para saber se o service respeita o limite de paradas
    const test2 = await graphService.allPaths(1, 1, 4, 1);
    expect(test2).toBeDefined();
    expect(test2).toStrictEqual([allPathsMock[1]]);
  });

  it('should find the shortest path', async () => {
    const test = await graphService.shortestPath(1, 1, 4);
    expect(test).toBeDefined();
    expect(test).toStrictEqual(shortestPathMock);
  });

  it('should delete a graph', async () => {
    const graph = await graphService.deleteGraph(1);
    expect(graph).toBeDefined();
    expect(graph).toStrictEqual({
      message: 'Graph deleted',
    });
  });

  it('should verify if a graph exists', async () => {
    const graph = await graphService.verifyPathGraph(1, 1, 2);
    expect(graph).toBeDefined();
    expect(graph).toStrictEqual(true);
  });
});
