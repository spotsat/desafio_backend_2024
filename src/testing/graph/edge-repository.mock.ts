import { getRepositoryToken } from '@nestjs/typeorm';
import { EdgeEntity } from '../../module/graph/entities/edge.entity';

export const edgeRepositoryMock = {
  provide: getRepositoryToken(EdgeEntity),
  useValue: {
    find: jest.fn().mockResolvedValue([
      {
        id: 4,
        name: 'default',
        origin: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
        destiny: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      },
      {
        id: 5,
        name: 'default',
        origin: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
        destiny: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
      },
      {
        id: 1,
        name: 'default',
        origin: {
          id: 1,
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
        destiny: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
      },
      {
        id: 2,
        name: 'default',
        origin: {
          id: 2,
          location: {
            type: 'Point',
            coordinates: [1, 1],
          },
        },
        destiny: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
      },
      {
        id: 3,
        name: 'default',
        origin: {
          id: 3,
          location: {
            type: 'Point',
            coordinates: [2, 2],
          },
        },
        destiny: {
          id: 4,
          location: {
            type: 'Point',
            coordinates: [3, 3],
          },
        },
      },
    ]),
  },
};
