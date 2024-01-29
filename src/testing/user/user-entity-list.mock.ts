// user.mock.ts

import { Role } from '../../enums/role.enum';
import { UserEntity } from '../../module/user/entity/user.entity';

export const userEntityList: UserEntity[] = [
  {
    id: 1,
    name: 'User Test',
    email: 'user@test.com',
    password: '$2b$10$yqeOFUreO7hclwVrJDECK.b0Afy5T4qlkmnU5IxPsuODud7GC6Gcu',
    role: Role.Admin,
  },
];
