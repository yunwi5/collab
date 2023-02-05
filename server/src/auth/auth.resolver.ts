import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpInput, SignInInput, SignInResponse } from './dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignInResponse)
  @UseGuards(GqlAuthGuard)
  signIn(@Args('signInInput') _: SignInInput, @Context() context: any) {
    return this.authService.signIn(context.user);
  }

  @Mutation(() => User)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }
}
