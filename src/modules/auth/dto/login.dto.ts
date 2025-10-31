import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Length(8, 100, {
    message: 'Password must be at least 8-100 characters long',
  })
  readonly password: string;
}
