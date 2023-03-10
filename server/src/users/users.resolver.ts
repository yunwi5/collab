import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { JwtAuthGuard } from 'src/auth/guards';
import { JwtUser } from 'src/auth/auth.types';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput } from './dto';
import { CurrentUser } from './decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findById(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.findById(id);
    if (user == null) throw new NotFoundException('User not found');
    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @CurrentUser() currentUser: JwtUser,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    if (currentUser.userId !== updateUserInput.userId) {
      throw new ForbiddenException('not allowed to update this user');
    }

    return this.usersService.update(updateUserInput.userId, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  removeUser(
    @CurrentUser() currentUser: JwtUser,
    @Args('id', { type: () => String }) id: string,
  ) {
    if (currentUser.userId !== id) {
      throw new ForbiddenException('not allowed to delete this user');
    }

    return this.usersService.remove(id);
  }
}
