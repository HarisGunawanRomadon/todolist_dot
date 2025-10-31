import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Length(3, 100, {
    message: 'Name must be at least 3-100 characters long',
  })
  name: string;
}
