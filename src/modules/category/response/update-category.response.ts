import { Expose } from 'class-transformer';

export class UpdateCategoryResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
