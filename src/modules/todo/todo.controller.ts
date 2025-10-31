import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
  HttpCode,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LoggedInGuard } from '../../common/guards/logged-in.guard';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { User } from '../../database/entities/user.entity';
import { CreateTodoResponse } from './response/create-todo.response';
import { GetTodoResponse } from './response/get-todo.response';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
@UseGuards(LoggedInGuard)
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @ResponseMessage('Todo Created Successfully')
  async create(
    @Auth() user: User,
    @Body() request: CreateTodoDto,
  ): Promise<CreateTodoResponse> {
    return this.todoService.create(request, user.id);
  }

  @Get()
  @ResponseMessage('Get All Todos Successfully')
  async findAll(@Auth() user: User): Promise<GetTodoResponse[]> {
    return this.todoService.findAll(user.id);
  }

  @Patch(':id')
  @ResponseMessage('Update Todos Successfully')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('id', ParseIntPipe) userId: number,
    @Body() request: UpdateTodoDto,
  ) {
    return this.todoService.update(userId, request, user.id);
  }

  @Delete(':id')
  @ResponseMessage('Deleted Todo Successfully')
  @HttpCode(200)
  async remove(@Auth() user: User, @Param('id', ParseIntPipe) todoId: number) {
    return this.todoService.remove(todoId, user.id);
  }
}
