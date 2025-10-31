import { Exclude, Expose } from 'class-transformer';

export class GetUserResponse {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}
