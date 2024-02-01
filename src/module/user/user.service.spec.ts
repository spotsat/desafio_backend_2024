// user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { userEntityList } from '../../testing/user/user-entity-list.mock';
import { createUserDto } from '../../testing/user/create-user-dto.mock';
import { updatePutUserDto } from '../../testing/user/update-put-user-dto.mock';
import { updatePatchUserDto } from '../../testing/user/update-patch-user-dto.mock';
import { userRepositoryMock } from '../../testing/user/user-repository.mock';

describe('Users', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, userRepositoryMock],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(userService).toBeDefined();
  });

  test('should create a user', async () => {
    const result = await userService.create(createUserDto);

    expect(result).toEqual(userEntityList[0]);
  });

  test('should be read a user', async () => {
    const result = await userService.show(1);

    expect(result).toEqual(userEntityList[0]);
  });

  test('should be update a user', async () => {
    const result = await userService.update(1, updatePutUserDto);

    expect(result).toEqual(userEntityList[0]);
  });

  test('should be update partial a user', async () => {
    const result = await userService.updatePartial(1, updatePatchUserDto);

    expect(result).toEqual(userEntityList[0]);
  });

  test('should be delete user', async () => {
    const result = await userService.delete(1);

    expect(result).toEqual(true);
  });
});
