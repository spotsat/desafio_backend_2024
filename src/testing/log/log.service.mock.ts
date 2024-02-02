import { LogService } from '../../module/log/log.service';

export const logServiceMock = {
  provide: LogService,
  useValue: {
    logMessage: jest.fn().mockResolvedValue(true),
    logError: jest.fn().mockResolvedValue(true),
    logInfo: jest.fn().mockResolvedValue(true),
    logWarn: jest.fn().mockResolvedValue(true),
    getLogs: jest.fn().mockResolvedValue([]),
  },
};
