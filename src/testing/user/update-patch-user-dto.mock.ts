import { Role } from '../../enums/role.enum';
import { UpdatePatchUserDto } from 'src/module/user/dto/update-patch-user.dto';

export const updatePatchUserDto: UpdatePatchUserDto = {
  email: 'user@email.com.br',
  name: 'User Test',
  password: '123456',
  role: Role.User,
};
