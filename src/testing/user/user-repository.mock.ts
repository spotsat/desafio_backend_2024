import { userEntityList } from './user-entity-list.mock';

export const userRepositoryMock = {
  provide: 'UserRepository',
  useValue: {
    user: {
      count: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockResolvedValue(userEntityList[0]),
      find: jest.fn().mockResolvedValue(userEntityList),
      findUnique: jest.fn().mockResolvedValue(userEntityList[0]),
      findFirst: jest.fn().mockResolvedValue(userEntityList[0]),
      update: jest.fn().mockResolvedValue(userEntityList[0]),
      delete: jest.fn().mockResolvedValue(true),
    },
  },
};
