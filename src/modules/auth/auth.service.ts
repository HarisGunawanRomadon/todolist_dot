import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterResponse } from './response/register.response';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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

    // const resultData = result.raw[0];

    this.logger.info(`Register Result : ${JSON.stringify(result)}`);

    return plainToInstance(RegisterResponse, result.raw[0], {
      excludeExtraneousValues: true,
    });
  }
}
