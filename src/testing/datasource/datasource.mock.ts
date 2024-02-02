import { DataSource } from 'typeorm';

export const dataSourceMock = {
  provide: DataSource,
  useValue: {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn().mockResolvedValue(null),
      startTransaction: jest.fn().mockResolvedValue(null),
      commitTransaction: jest.fn().mockResolvedValue(null),
      rollbackTransaction: jest.fn().mockResolvedValue(null),
      release: jest.fn().mockResolvedValue(null),
      manager: {
        save: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(true),
      },
    }),
    query: jest.fn().mockResolvedValue([{ distance: 1 }]),
  },
};
