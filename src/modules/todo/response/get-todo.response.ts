import { Expose, Transform } from 'class-transformer';

export class GetTodoResponse {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  priority: string;

  @Expose({ name: 'category_id' })
  category: string;

  @Expose({ name: 'due_date' })
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  })
  dueDate: string;

  @Expose({ name: 'completed_at' })
  @Transform(({ value }) => {
    if (!value) return null;
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  })
  completedAt: string;
}
