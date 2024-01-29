import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from '../../decorators/param-id.decorator';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { RoleGuard } from '../../guards/role.guard';
import { LogInterceptor } from '../../interceptors/log.interceptor';
import { AuthGuard } from '../../guards/auth.guard';
import * as bcrypt from 'bcrypt';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Get()
  async list() {
    console.log('list');
    return this.userService.list();
  }

  // @SkipThrottle() // Ignora rate limit
  @Get(':id')
  async show(@ParamId() id: number) {
    await this.userService.exists(id);
    return this.userService.show(id);
  }

  @Put(':id')
  async update(
    @Body() data: UpdatePutUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.userService.exists(id);

    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.userService.exists(id);
    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.exists(id);
    return this.userService.delete(id);
  }
}
