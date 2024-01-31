import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';
import { graphRepositoryMock } from '../../testing/graph/graph-repository.mock';
import { edgeRepositoryMock } from '../../testing/graph/edge-repository.mock';
import { pointRepositoryMock } from '../../testing/graph/point-repository.mock';
import { dataSourceMock } from '../../testing/datasource/datasource.mock';
import { createGraphDtoMock } from '../../testing/graph/create-graph-dto.mock';
import { graphResponseList } from '../../testing/graph/createe-graph-responselist';

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
    expect(graph).toStrictEqual(graphResponseList[0]);
  });
});
