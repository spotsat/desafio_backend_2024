import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

//Partial

export class UpdatePatchUserDto extends PartialType(CreateUserDTO) {}
