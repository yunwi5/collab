import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { SignUpInput, SignInResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByName(username);
    if (user == null) throw new NotFoundException();

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (passwordCorrect) {
      return user;
    }

    throw new BadRequestException('Wrong Credentials');
  }

  makeJwtToken(user: User): string {
    return this.jwtService.sign({
      sub: user.userId,
      username: user.username,
    });
  }

  async signIn(user: User): Promise<SignInResponse> {
    if (user == null) throw new NotFoundException();

    return {
      access_token: this.makeJwtToken(user),
      user,
    };
  }

  async signUp(signUpInput: SignUpInput): Promise<User> {
    const user = await this.userService.findByName(signUpInput.username);

    if (user) throw new BadRequestException('User already exists!');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(signUpInput.password, salt);

    return await this.userService.create({
      username: signUpInput.username,
      email: signUpInput.email,
      password: hashedPassword,
    });
  }
}
