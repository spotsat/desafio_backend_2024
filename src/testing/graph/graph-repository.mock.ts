import { getRepositoryToken } from '@nestjs/typeorm';
import { GraphEntity } from '../../module/graph/entities/graph.entity';

export const graphRepositoryMock = {
  provide: getRepositoryToken(GraphEntity),
  useValue: {
    find: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Graph Test',
    }),
    save: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Graph Test',
    }),
  },
};
