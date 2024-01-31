import { getRepositoryToken } from '@nestjs/typeorm';
import { PointEntity } from '../../module/graph/entities/point.entity';
export const pointRepositoryMock = {
  provide: getRepositoryToken(PointEntity),
  useValue: {
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'default',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      {
        id: 2,
        name: 'default',
        location: {
          type: 'Point',
          coordinates: [1, 1],
        },
      },
      {
        id: 3,
        name: 'default',
        location: {
          type: 'Point',
          coordinates: [2, 2],
        },
      },
      {
        id: 4,
        name: 'default',
        location: {
          type: 'Point',
          coordinates: [3, 3],
        },
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Point Test',
    }),
    save: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Point Test',
    }),
    map: jest.fn().mockResolvedValue({}),
  },
};
