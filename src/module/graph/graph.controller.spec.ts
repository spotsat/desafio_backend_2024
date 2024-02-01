import { Test, TestingModule } from '@nestjs/testing';
import { GraphController } from './graph.controller';
import { graphServiceMock } from '../../testing/graph/graph-service.mock';
import { authServiceMock } from '../../testing/auth/auth-service.mock';
import { userServiceMock } from '../../testing/user/user-service.mock';
import { logServiceMock } from '../../testing/log/log.service.mock';
import { graphEntityList } from '../../testing/graph/create-graph-entity-list';
import { createGraphDtoMock } from '../../testing/graph/create-graph-dto.mock';
import { shortestPathMock } from '../../testing/graph/shortest-path.mock';
import { allPathsMock } from '../../testing/graph/all-paths.mock';

describe('GraphController', () => {
  let graphController: GraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphController],
      providers: [
        graphServiceMock,
        authServiceMock,
        userServiceMock,
        logServiceMock,
      ],
    }).compile();

    graphController = module.get<GraphController>(GraphController);
  });

  it('should be defined', () => {
    expect(graphController).toBeDefined();
  });

  it('should read a graph', async () => {
    const result = await graphController.read(1);

    expect(result).toEqual(graphEntityList[0]);
  });

  it('should create a graph', async () => {
    const result = await graphController.create(createGraphDtoMock[0]);

    expect(result).toEqual(graphEntityList[0]);
  });

  it('should be delete a graph', async () => {
    const result = await graphController.delete(1);

    expect(result).toEqual(true);
  });

  it('should return the shortest path', async () => {
    const result = await graphController.readShortestPath(1, 1, 4);

    expect(result).toBeDefined();
    expect(result).toStrictEqual(shortestPathMock);
  });

  it('should return all paths', async () => {
    const test1 = await graphController.listAllPaths(1, 1, 4, 0);

    expect(test1).toBeDefined();
    expect(test1).toStrictEqual(allPathsMock);

    const test2 = await graphController.listAllPaths(1, 1, 4, 1);
    expect(test2).toBeDefined();
    console.log(test2);
    console.log(allPathsMock[1]);
    expect(test2).toStrictEqual([allPathsMock[1]]);
  });
});
