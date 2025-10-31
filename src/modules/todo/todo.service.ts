import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '../../database/entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoResponse } from './response/create-todo.response';
import { plainToInstance } from 'class-transformer';
import { GetTodoResponse } from './response/get-todo.response';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTodoResponse } from './response/update-todo.response';

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

  async findAll(userId: number): Promise<GetTodoResponse[]> {
    const todos = await this.todoRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        dueDate: true,
        completedAt: true,
      },
    });

    this.logger.debug(`Get All Todos : ${JSON.stringify(todos)}`);

    return plainToInstance(GetTodoResponse, todos, {
      excludeExtraneousValues: true,
    });
  }

  async remove(todoId: number, userId: number) {
    const todo = await this.todoRepo.findOne({
      where: {
        id: todoId,
        user: {
          id: userId,
        },
      },
    });

    if (!todo) throw new NotFoundException('Todo is not found');

    return await this.todoRepo.delete({
      id: todoId,
      user: {
        id: userId,
      },
    });
  }

  async update(
    id: number,
    request: UpdateTodoDto,
    userId: number,
  ): Promise<UpdateTodoResponse> {
    const todo = await this.todoRepo.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    this.logger.info(`Todo Result ${JSON.stringify(todo)}`);

    if (!todo) throw new NotFoundException('Todo not found');

    if (request.title !== undefined) todo.title = request.title;
    if (request.description !== undefined)
      todo.description = request.description;
    if (request.status !== undefined) todo.status = request.status;
    if (request.priority !== undefined) todo.priority = request.priority;
    if (request.category !== undefined)
      (todo as any).category = { id: request.category };
    if (request.dueDate !== undefined) todo.dueDate = request.dueDate;
    if (request.completedAt !== undefined)
      todo.completedAt = request.completedAt;

    const result = await this.todoRepo
      .createQueryBuilder()
      .update(Todo)
      .set({
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate,
        completedAt: todo.completedAt,
      })
      .where('id = :id AND "user_id" = :userId', { id, userId })
      .returning([
        'id',
        'title',
        'description',
        'status',
        'priority',
        'category_id',
        'dueDate',
        'completedAt',
      ])
      .execute();

    return plainToInstance(UpdateTodoResponse, result.raw[0], {
      excludeExtraneousValues: true,
    });
  }
}
