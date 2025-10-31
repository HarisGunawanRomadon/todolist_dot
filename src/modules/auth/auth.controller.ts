import { Controller, Post, Body, Inject, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterResponse } from './response/register.response';
import { LoginResponse } from './response/login.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('/register')
  @ResponseMessage('Register Successfully')
  async register(@Body() request: RegisterDto): Promise<RegisterResponse> {
    this.logger.debug(`Register Request : ${JSON.stringify(request)}`);
    return this.authService.register(request);
  }

  @Post('/login')
  @HttpCode(200)
  @ResponseMessage('Login Successfully')
  async login(@Body() request: LoginDto): Promise<LoginResponse> {
    // this.logger.debug(`Login Request : ${JSON.stringify(request)}`);
    this.logger.info(`NODE_ENV : ${process.env.NODE_ENV}`);
    return this.authService.login(request);
  }
}
