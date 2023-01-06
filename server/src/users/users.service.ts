import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { dbTables } from 'src/config/env.config';
import { SsoUserInput } from 'src/auth-sso/dto';
import { CreateUserInput, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { UserModel } from './db/user.model';

@Injectable()
export class UsersService {
  async create(createUserInput: CreateUserInput | SsoUserInput): Promise<User> {
    try {
      const userId: string = crypto.randomUUID();
      const newUser = await UserModel.create({ userId, ...createUserInput });
      return newUser;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not create a user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await UserModel.scan().exec();
      return users;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not fetch users');
    }
  }

  async findByName(name: string): Promise<User | null> {
    try {
      const users = await UserModel.query('username')
        .eq(name)
        .using(dbTables.UserTableNameIndex)
        .exec();

      const user = users[0];
      return user;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not find user by name');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.get(id);
      return user;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not find user by id');
    }
  }

  // provider sub
  async findBySub(sub: string): Promise<User> {
    const users = await UserModel.scan('sub').eq(sub).exec();
    return users[0];
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const { userId, ...updateInput } = updateUserInput;
      const updated = await UserModel.update({ userId: id }, updateInput);
      return updated;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not update user');
    }
  }

  async remove(id: string): Promise<User> {
    const user = await UserModel.get(id);
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    try {
      await user.delete();
      return user;
    } catch (err) {
      console.log((err as any).message);
      throw new InternalServerErrorException('could not delete user by id');
    }
  }
}
