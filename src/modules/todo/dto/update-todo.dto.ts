import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { todoPriority, todoStatus } from '../../../database/entities/enum.type';
import { Transform } from 'class-transformer';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message: 'Title must be at least 1-100 characters long',
  })
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(todoStatus, {
    message: 'type must be one of: pending, in_progress, completed',
  })
  status?: todoStatus;

  @IsOptional()
  @IsEnum(todoPriority, {
    message: 'type must be one of: low, medium, high',
  })
  priority?: todoPriority;

  @IsOptional()
  @IsNumber({}, { message: 'category must be a number' })
  category?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value == null) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split('-').map(Number);
      return new Date(Date.UTC(yyyy, mm - 1, dd));
    }
    return new Date(value);
  })
  @IsDate({ message: 'dueDate must be a valid date' })
  dueDate?: Date;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value == null) return undefined;
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split('-').map(Number);
      return new Date(Date.UTC(yyyy, mm - 1, dd));
    }
    return new Date(value);
  })
  @IsDate({ message: 'completedAt must be a valid date' })
  completedAt?: Date;
}
