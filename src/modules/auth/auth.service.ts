import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterResponse } from './response/register.response';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../model/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './response/login.response';
import { GetUserResponse } from './response/get-user.response';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(request: RegisterDto): Promise<RegisterResponse> {
    const usernameIfExist = await this.userRepo.findOne({
      where: {
        username: request.username,
      },
    });

    if (usernameIfExist)
      throw new ConflictException('Username already registered');

    const emailIfExist = await this.userRepo.findOne({
      where: {
        email: request.email,
      },
    });

    if (emailIfExist) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const result = await this.userRepo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        fullName: request.fullName,
        username: request.username,
        email: request.email,
        password: hashedPassword,
      })
      .returning(['id', 'fullName', 'username', 'email'])
      .execute();

    const raw = result.raw[0];
    const mapped = {
      id: raw.id,
      fullName: raw.full_name,
      username: raw.username,
      email: raw.email,
    };

    this.logger.info(`Register Result : ${JSON.stringify(mapped)}`);

    return plainToInstance(RegisterResponse, mapped, {
      excludeExtraneousValues: true,
    });
  }

  async login(request: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepo.findOne({
      where: {
        email: request.email,
      },
    });

    if (!user) throw new UnauthorizedException('Email or Password is Wrong');

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Email or Password is Wrong');

    const payload: JwtPayload = {
      sub: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const result = {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    };

    this.logger.info(`Login Result : ${JSON.stringify(result)}`);

    return plainToInstance(LoginResponse, result, {
      excludeExtraneousValues: true,
    });
  }

  async getUser(userId: number): Promise<GetUserResponse> {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
      },
    });

    if (!user) throw new UnauthorizedException('User not found');

    this.logger.debug(`Get User Result : ${JSON.stringify(user)}`);

    return plainToInstance(GetUserResponse, user, {
      excludeExtraneousValues: true,
    });
  }
}
