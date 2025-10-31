import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { todoPriority, todoStatus } from './enum.type';

@Entity({ name: 'todos' })
@Index('idx_todos_user_status', ['user', 'status'])
@Index('idx_todos_user_category', ['user', 'category'])
@Index('idx_todos_user_due_date', ['user', 'dueDate'])
export class Todo extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: todoStatus, default: todoStatus.PENDING })
  status: todoStatus;

  @Column({ type: 'enum', enum: todoPriority, default: todoPriority.MEDIUM })
  priority: todoPriority;

  @Column({
    name: 'due_date',
    type: 'timestamptz',
    nullable: true,
    default: () => 'now()',
  })
  dueDate: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, (u) => u.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (c) => c.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
