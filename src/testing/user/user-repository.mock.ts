import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../module/user/entity/user.entity';
import { userEntityList } from './user-entity-list.mock';

export const userRepositoryMock = {
  provide: getRepositoryToken(UserEntity),
  useValue: {
    find: jest.fn().mockResolvedValue(userEntityList),
    findOne: jest.fn().mockResolvedValue(userEntityList[0]),
    save: jest.fn().mockResolvedValue(userEntityList[0]),
    delete: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(userEntityList[0]),
  },
};
