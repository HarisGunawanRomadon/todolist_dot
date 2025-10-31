import { Expose } from 'class-transformer';

export class CreateCategoryResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
