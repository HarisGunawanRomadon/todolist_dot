import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../../model/uses.request';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: UserRequest = context.switchToHttp().getRequest();
    return request.user;
  },
);
