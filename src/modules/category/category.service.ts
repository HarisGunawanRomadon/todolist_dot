import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../database/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryResponse } from './response/create-category.response';
import { plainToInstance } from 'class-transformer';

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

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
