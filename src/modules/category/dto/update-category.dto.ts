import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(3, 100, {
    message: 'Name must be at least 3-100 characters long',
  })
  name?: string;
}
