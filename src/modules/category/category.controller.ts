import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCategoryResponse } from './response/create-category.response';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { LoggedInGuard } from '../../common/guards/logged-in.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { User } from '../../database/entities/user.entity';
import { GetCategoryResponse } from './response/get-category.response';

@Controller('category')
@UseGuards(LoggedInGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ResponseMessage('Create Category Successfully')
  async create(
    @Auth() user: User,
    @Body() request: CreateCategoryDto,
  ): Promise<CreateCategoryResponse> {
    return this.categoryService.create(user.id, request);
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get All Category Successfully')
  async findAll(@Auth() user: User): Promise<CreateCategoryResponse[]> {
    return this.categoryService.findAll(user.id);
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get Category Successfully')
  async findOne(
    @Auth() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetCategoryResponse> {
    return this.categoryService.findOne(id, user.id);
  }

  //
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  @ResponseMessage('Delete Category Successfully')
  @HttpCode(200)
  async remove(@Auth() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id, user.id);
  }
}
