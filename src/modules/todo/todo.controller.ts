import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
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
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
  //   return this.todoService.update(+id, updateTodoDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
