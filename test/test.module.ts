import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/database/entities/user.entity';
import { Category } from '../src/database/entities/category.entity';
import { Todo } from '../src/database/entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Todo])],
  providers: [TestService],
})
export class TestModule {}
