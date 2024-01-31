import { CreateGraphDto } from '../../module/graph/dto/create-graph.dto';

export const createGraphDtoMock: CreateGraphDto = {
  name: 'Graph Test',
  vertices: [
    {
      vertexId: 1,
      data: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
    {
      vertexId: 2,
      data: {
        type: 'Point',
        coordinates: [1, 1],
      },
    },
    {
      vertexId: 3,
      data: {
        type: 'Point',
        coordinates: [2, 2],
      },
    },
    {
      vertexId: 4,
      data: {
        type: 'Point',
        coordinates: [3, 3],
      },
    },
  ],
  edges: [
    {
      originId: 1,
      destinyId: 2,
    },
    {
      originId: 2,
      destinyId: 3,
    },
    {
      originId: 3,
      destinyId: 4,
    },
    {
      originId: 4,
      destinyId: 1,
    },
    {
      originId: 4,
      destinyId: 2,
    },
  ],
};
