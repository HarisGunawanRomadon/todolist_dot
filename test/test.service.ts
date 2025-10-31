import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Category } from '../src/database/entities/category.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async deleteUser() {
    await this.userRepo.delete({
      email: 'test@mail.com',
    });
  }

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

  async getCategory() {
    const user = await this.userRepo.findOne({
      where: {
        email: 'test@mail.com',
      },
    });

    const category = await this.categoryRepo.findOne({
      where: {
        user: {
          id: user?.id,
        },
      },
      select: {
        id: true,
      },
    });

    return Number(category?.id);
  }

  async createCategory() {
    const user = await this.userRepo.findOne({
      where: {
        email: 'test@mail.com',
      },
    });

    await this.categoryRepo.save({
      name: 'test category',
      user: {
        id: user?.id,
      },
    });
  }

  async createManyCategory() {
    const user = await this.userRepo.findOne({
      where: {
        email: 'test@mail.com',
      },
    });

    await this.categoryRepo.save([
      {
        name: 'Test',
        user: {
          id: user?.id,
        },
      },
      {
        name: 'school',
        user: {
          id: user?.id,
        },
      },
    ]);
  }

  async deleteCategory() {
    const user = await this.userRepo.findOne({
      where: {
        email: 'test@mail.com',
      },
    });

    await this.categoryRepo.delete({
      user: {
        id: user?.id,
      },
    });
  }
}
