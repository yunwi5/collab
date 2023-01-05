import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  /* eslint-disable-next-line @typescript-eslint/no-useless-constructor */
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    // Take the context and create request object that
    // passport local expects to have
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().signInInput;
    return request;
  }
}
