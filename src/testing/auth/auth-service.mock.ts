import { AuthService } from '../../module/auth/auth.service';
import { accessToken } from './access-token.mock';
import { jwtPayload } from './jwt-payload.mock';
import { resetToken } from './reset-token.mock';

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockResolvedValue(accessToken),
    checkToken: jest.fn().mockResolvedValue(jwtPayload),
    isValidToken: jest.fn().mockResolvedValue(true),
    login: jest.fn().mockResolvedValue(accessToken),
    forget: jest.fn().mockResolvedValue(true),
    reset: jest.fn().mockResolvedValue(resetToken),
    register: jest.fn().mockResolvedValue(accessToken),
  },
};
