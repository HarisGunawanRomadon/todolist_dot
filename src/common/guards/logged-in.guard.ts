import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../../model/jwt-payload.interface';

@Injectable()
export class LoggedInGuard extends AuthGuard('jwt') {
  handleRequest<T = JwtPayload>(
    err: Error | null,
    user: T | false,
    info: { message?: string } | undefined,
  ): T {
    if (err || !user) {
      throw new UnauthorizedException(info?.message || 'Unauthorized');
    }

    return user;
  }
}
