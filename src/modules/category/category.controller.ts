import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateCategoryResponse } from './response/create-category.response';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { LoggedInGuard } from '../../common/guards/logged-in.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { User } from '../../database/entities/user.entity';

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
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
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
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
