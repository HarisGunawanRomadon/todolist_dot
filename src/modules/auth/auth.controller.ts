import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterResponse } from './response/register.response';
import { LoginResponse } from './response/login.response';
import { Auth } from '../../common/decorators/auth.decorator';
import { User } from '../../database/entities/user.entity';
import { GetUserResponse } from './response/get-user.response';
import { LoggedInGuard } from '../../common/guards/logged-in.guard';

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

  @UseGuards(LoggedInGuard)
  @Get('/me')
  @HttpCode(200)
  @ResponseMessage('Get User Successfully')
  async getUser(@Auth() user: User): Promise<GetUserResponse> {
    this.logger.debug(`Get User Request : ${JSON.stringify(user)}`);
    return this.authService.getUser(user.id);
  }
}
