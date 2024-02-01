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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar um novo usuário',
    description:
      'Para criar um usuário, é necessário informar o nome, email e senha.)',
    security: [{ bearerAuth: ['token'] }],
  })
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Lista todos os usuários cadastrados no sistema.',
  })
  @ApiBearerAuth()
  @Get()
  async list() {
    return this.userService.list();
  }

  @ApiOperation({
    summary: 'Detalhar um usuário',
    description: 'Detalha um usuário específico.',
  })
  @Get(':id')
  async show(@ParamId() id: number) {
    await this.userService.exists(id);
    return this.userService.show(id);
  }

  @ApiOperation({
    summary: 'Atualizar um usuário',
    description: 'Atualiza um usuário específico.',
  })
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

  @ApiOperation({
    summary: 'Atualizar parcialmente um usuário',
    description: 'Atualiza parcialmente um usuário específico.',
  })
  @Patch(':id')
  async updatePartial(
    @Body() data: UpdatePatchUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.userService.exists(id);
    return this.userService.updatePartial(id, data);
  }

  @ApiOperation({
    summary: 'Deletar um usuário',
    description: 'Deleta um usuário específico.',
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.exists(id);
    return this.userService.delete(id);
  }
}
