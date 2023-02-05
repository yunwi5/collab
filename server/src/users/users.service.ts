import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'crypto';

import { dbTables } from 'src/config/env.config';
import { SsoUserInput } from 'src/auth-sso/dto';
import { getLogger } from 'src/config/logger.config';
import { getErrorMessage } from 'src/utils/error.util';
import { CreateUserInput, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { UserModel } from './db/user.model';

@Injectable()
export class UsersService {
  private readonly logger = getLogger(UsersService.name);

  async create(createUserInput: CreateUserInput | SsoUserInput): Promise<User> {
    try {
      const userId: string = crypto.randomUUID();
      const newUser = await UserModel.create({ userId, ...createUserInput });
      this.logger.info('create a new user; user: %s;', newUser);
      return newUser;
    } catch (err) {
      this.logger.error(
        'could not create a user; err: %s;',
        getErrorMessage(err),
      );
      throw new InternalServerErrorException('could not create a user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await UserModel.scan().exec();
      return users;
    } catch (err) {
      this.logger.error('could not find users; err: %s;', getErrorMessage(err));
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
      this.logger.error(
        'could not find user by name; name: %s; err: %s;',
        name,
        getErrorMessage(err),
      );
      throw new InternalServerErrorException('could not find user by name');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.get(id);
      return user;
    } catch (err) {
      this.logger.error(
        'could not find user by ID; ID: %s; err: %s;',
        id,
        getErrorMessage(err),
      );
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
      this.logger.error(
        'could not update user by ID; ID: %s; input %s; err: %s;',
        id,
        updateUserInput,
        getErrorMessage(err),
      );
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
      this.logger.error(
        'could not remove user by ID; ID: %s; err: %s;',
        id,
        getErrorMessage(err),
      );
      throw new InternalServerErrorException('could not delete user by id');
    }
  }
}
