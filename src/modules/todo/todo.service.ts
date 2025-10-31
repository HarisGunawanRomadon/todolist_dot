import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../../database/entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoResponse } from './response/create-todo.response';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TodoService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectRepository(Todo) private readonly todoRepo: Repository<Todo>,
  ) {}
  async create(
    request: CreateTodoDto,
    userId: number,
  ): Promise<CreateTodoResponse> {
    const todo = await this.todoRepo
      .createQueryBuilder()
      .insert()
      .into(Todo)
      .values({
        title: request.title,
        description: request.description,
        status: request.status,
        priority: request.priority,
        category: {
          id: request.category,
        },
        dueDate: request.dueDate,
        completedAt: request.completedAt,
        user: {
          id: userId,
        },
      })
      .returning([
        'id',
        'title',
        'description',
        'status',
        'priority',
        'category',
        'dueDate',
        'completedAt',
      ])
      .execute();

    this.logger.debug(`Result Todo : ${JSON.stringify(todo)}`);

    return plainToInstance(CreateTodoResponse, todo.raw[0], {
      excludeExtraneousValues: true,
    });
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  // update(id: number, updateTodoDto: UpdateTodoDto) {
  //   return `This action updates a #${id} todo`;
  // }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
