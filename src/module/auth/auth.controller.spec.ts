import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { authServiceMock } from '../../testing/auth/auth-service.mock';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { jwtServiceMock } from '../../testing/auth/jwt-service.mock';
import { mailerServiceMock } from '../../testing/auth/mailer-service.mock';
import { userServiceMock } from '../../testing/user/user-service.mock';
import { createUserDto } from '../../testing/user/create-user-dto.mock';
import { accessToken } from '../../testing/auth/access-token.mock';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        userServiceMock,
        authServiceMock,
        jwtServiceMock,
        mailerServiceMock,
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

    authController = module.get<AuthController>(AuthController);
  });

  test('should be defined', () => {
    expect(authController).toBeDefined();
  });

  test('login', async () => {
    const { email, password } = createUserDto;
    const result = await authController.login({
      email,
      password,
    });

    expect(result).toEqual(accessToken);
  });

  test('register', async () => {
    const result = await authController.register(createUserDto);

    expect(result).toEqual(accessToken);
  });

  //   test('forget', async () => {
  //     const result = await authController.forget({
  //       email: createUserDto.email,
  //     });

  //     expect(result).toEqual(true);
  //   });

  //   test('reset', async () => {
  //     const result = await authController.reset({
  //       password: createUserDto.password,
  //       token: accessToken,
  //     });

  //     expect(result).toEqual(resetToken);
  //   });
});
