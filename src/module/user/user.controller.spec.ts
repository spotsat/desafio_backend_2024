import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { userServiceMock } from '../../testing/user/user-service.mock';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { UserService } from './user.service';
import { createUserDto } from '../../testing/user/create-user-dto.mock';
import { userEntityList } from '../../testing/user/user-entity-list.mock';
import { updatePutUserDto } from '../../testing/user/update-put-user-dto.mock';
import { updatePatchUserDto } from '../../testing/user/update-patch-user-dto.mock';
import { jwtServiceMock } from '../../testing/auth/jwt-service.mock';
import { authServiceMock } from '../../testing/auth/auth-service.mock';
import { logServiceMock } from '../../testing/log/log.service.mock';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        userServiceMock,
        authServiceMock,
        jwtServiceMock,
        logServiceMock,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  test('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    test('shoud be create', async () => {
      const result = await userController.create(createUserDto);

      expect(result).toEqual(userEntityList[0]);
    });

    test('should be read an user', async () => {
      const result = await userController.show(1);

      expect(result).toEqual(userEntityList[0]);
    });

    test('should be list users', async () => {
      const result = await userController.list();

      expect(result).toEqual(userEntityList);
    });

    test('should be update user', async () => {
      const result = await userController.update(updatePutUserDto, 1);

      expect(result).toEqual(userEntityList[0]);
    });

    test('should be update partial an user', async () => {
      const result = await userController.updatePartial(updatePatchUserDto, 1);

      expect(result).toEqual(userEntityList[0]);
    });

    test('should delete a user', async () => {
      const result = await userController.delete(1);

      expect(result).toEqual(true);
    });
  });

  describe('Guards', () => {
    test('if the guard was applied', async () => {
      const guards = Reflect.getMetadata('__guards__', UserController);

      expect(guards.length).toEqual(2);
      expect(new guards[0]()).toBeInstanceOf(AuthGuard);
      expect(new guards[1]()).toBeInstanceOf(RoleGuard);
    });
  });
});
