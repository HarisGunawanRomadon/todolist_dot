import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../database/entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategoryResponse } from './response/create-category.response';
import { plainToInstance } from 'class-transformer';
import { GetCategoryResponse } from './response/get-category.response';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(
    userId: number,
    request: CreateCategoryDto,
  ): Promise<CreateCategoryResponse> {
    const categoryIfExist = await this.categoryRepo.findOne({
      where: {
        name: request.name,
        user: { id: userId },
      },
    });

    if (categoryIfExist) throw new ConflictException('Category already exist');

    const result = await this.categoryRepo
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values({
        name: request.name,
        user: { id: userId },
      })
      .returning(['id', 'name'])
      .execute();

    this.logger.debug(`Create Category Result : ${JSON.stringify(result)}`);

    return plainToInstance(CreateCategoryResponse, result.raw[0], {
      excludeExtraneousValues: true,
    });
  }

  async findAll(userId: number): Promise<GetCategoryResponse[]> {
    const categories = await this.categoryRepo.find({
      where: {
        user: { id: userId },
      },
      select: {
        id: true,
        name: true,
      },
    });

    this.logger.debug(
      `Get All Category Result : ${JSON.stringify(categories)}`,
    );

    return plainToInstance(GetCategoryResponse, categories, {
      excludeExtraneousValues: true,
    });
  }

  // async findOne(categoryId: number, userId: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  async remove(categoryId: number, userId: number): Promise<DeleteResult> {
    const category = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
      },
    });

    this.logger.debug(`Remove Category Result : ${JSON.stringify(category)}`);

    if (!category) throw new NotFoundException('Category not found');

    return await this.categoryRepo.delete({
      id: categoryId,
      user: { id: userId },
    });
  }
}
