import { LoginResponse } from '../modules/auth/response/login.response';
import { Request } from 'express';

export interface UserRequest extends Request {
  user?: LoginResponse;
}
