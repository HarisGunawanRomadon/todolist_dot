import { Expose } from 'class-transformer';

export class GetCategoryResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
