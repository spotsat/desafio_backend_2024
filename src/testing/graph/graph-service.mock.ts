import { GraphService } from '../../module/graph/graph.service';
import { allPathsMock } from './all-paths.mock';
import { graphEntityList } from './create-graph-entity-list';
import { shortestPathMock } from './shortest-path.mock';

export const graphServiceMock = {
  provide: GraphService,
  useValue: {
    createGraph: jest.fn().mockResolvedValue(graphEntityList[0]),
    readGraph: jest.fn().mockResolvedValue(graphEntityList[0]),
    shortestPath: jest.fn().mockResolvedValue(shortestPathMock),
    allPaths: jest.fn((id, originId, destinyId, limitStop) => {
      if (limitStop === 0) {
        return allPathsMock;
      } else if (limitStop === 1) {
        return [allPathsMock[1]];
      }

      return [];
    }),
    deleteGraph: jest.fn().mockResolvedValue(true),
  },
};
