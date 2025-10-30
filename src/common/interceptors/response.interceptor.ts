import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RES_MESSAGE } from '../decorators/response-message.decorator';
import { InterceptorResponse } from '../../model/interceptor.response';

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<any, InterceptorResponse>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<InterceptorResponse> {
    const req: Request = context.switchToHttp().getRequest();

    const defaults: Record<string, string> = {
      POST: 'Created Successfully',
      PUT: 'Updated Successfully',
      PATCH: 'Updated Successfully',
      DELETE: 'Deleted Successfully',
      GET: 'Get data Successfully',
    };
    const defaultMessage = defaults[req.method] ?? 'Success';

    const metaDataMessage =
      this.reflector.getAllAndOverride<string>(RES_MESSAGE, [
        context.getHandler(),
        context.getClass(),
      ]) ?? null;

    return next.handle().pipe(
      map(
        (data: InterceptorResponse): InterceptorResponse => ({
          message:
            (data && typeof data === 'object' && data.message) ||
            metaDataMessage ||
            defaultMessage,
          data:
            data && typeof data === 'object' && '__message' in data
              ? { ...data, __message: undefined }
              : data,
          timestamp: new Date().toISOString(),
        }),
      ),
    );
  }
}
