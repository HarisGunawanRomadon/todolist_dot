import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty({ message: 'Full Name is required' })
  @IsString()
  @Length(3, 100, {
    message: 'Full Name must be at least 3-100 characters long',
  })
  fullName!: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @Length(3, 100, {
    message: 'Username must be at least 3-100 characters long',
  })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.toLowerCase().replace(/\s+/g, '') : value,
  )
  username!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Length(8, 100, {
    message: 'Password must be at least 8-100 characters long',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one Specials character and one number',
  })
  password!: string;
}
