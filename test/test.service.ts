import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteAll() {
    await this.userRepo.deleteAll();
  }

  async createUser() {
    const password = await bcrypt.hash('Test_1234567890', 10);
    await this.userRepo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        fullName: 'Test',
        username: 'test',
        email: 'test@mail.com',
        password: password,
      })
      .execute();
  }
}
