import { Expose, Type } from 'class-transformer';
import { RegisterResponse } from './register.response';

export class LoginResponse {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => RegisterResponse)
  user: RegisterResponse;
}
