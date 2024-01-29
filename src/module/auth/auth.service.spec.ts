import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../../testing/user/user-repository.mock';
import { jwtServiceMock } from '../../testing/auth/jwt-service.mock';
import { mailerServiceMock } from '../../testing/auth/mailer-service.mock';
import { userServiceMock } from '../../testing/user/user-service.mock';
import { userEntityList } from '../../testing/user/user-entity-list.mock';
import { accessToken } from '../../testing/auth/access-token.mock';
import { jwtPayload } from '../../testing/auth/jwt-payload.mock';
// import { resetToken } from '../../testing/auth/reset-token.mock';
import { authRegisterDTO } from '../../testing/auth/auth-register-dto.mock';

describe('auth service', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userServiceMock,
        mailerServiceMock,
        userRepositoryMock,
        jwtServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('should be create token', () => {
      const result = authService.createToken(userEntityList[0]);

      expect(result.acessToken).toEqual(accessToken);
    });
    test('should be check token', () => {
      const result = authService.checkToken(accessToken);

      expect(result).toEqual(jwtPayload);
    });

    test('should be a valid token', () => {
      const result = authService.isValidToken(accessToken);

      expect(result).toEqual(true);
    });
  });

  describe('Authentication', () => {
    test('should be logged in', async () => {
      const result = await authService.login('daniel@email.com', '123456');

      expect(result.acessToken).toEqual(accessToken);
    });

    // test('forget password', async () => {
    //   const result = await authService.forget('daniel@email.com');

    //   expect(result).toEqual(true);
    // });

    // test('should be reset passwrd', async () => {
    //   const result = await authService.reset('123456', resetToken);

    //   expect(result.acessToken).toEqual(accessToken);
    // });

    test('register', async () => {
      const result = await authService.register(authRegisterDTO);

      expect(result.acessToken).toEqual(accessToken);
    });
  });
});
