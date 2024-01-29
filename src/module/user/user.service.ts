import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO) {
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return this.usersRepository.save(data);
  }

  async list() {
    return this.usersRepository.find();
  }

  async show(id: number) {
    await this.exists(id);
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, { email, name, password, role }: UpdatePutUserDto) {
    return this.usersRepository.update(
      { id },
      {
        ...(email && { email }),
        ...(name && { name }),
        ...(password && { password }),
        ...(role && { role }),
      },
    );
  }

  async updatePartial(
    id: number,
    { email, name, password, role }: UpdatePatchUserDto,
  ) {
    const data: any = {};

    if (email) data.email = email;
    if (name) data.name = name;
    if (password) data.password = password;
    if (role) data.role = role;

    return this.usersRepository.update({ id }, data);
  }

  async delete(id: number) {
    try {
      await this.usersRepository.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(id: number) {
    if (!(await this.usersRepository.findOne({ where: { id } }))) {
      throw new NotFoundException(`O usuário ${id} não existe!`);
    }
  }
}
