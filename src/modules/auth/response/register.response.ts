import { Exclude, Expose } from 'class-transformer';

export class RegisterResponse {
  @Expose()
  id: number;

  @Expose({ name: 'full_name' })
  fullName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}
