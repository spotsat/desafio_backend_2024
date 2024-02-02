import { Role } from '../../enums/role.enum';
import { CreateUserDTO } from 'src/module/user/dto/create-user.dto';

export const createUserDto: CreateUserDTO = {
  email: 'user@email.com.br',
  name: 'User Test',
  password: '123456',
  role: Role.User,
};
