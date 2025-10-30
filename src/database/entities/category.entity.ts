import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Todo } from './todo.entity';

@Entity({ name: 'categories' })
@Index(['user', 'name'], { unique: true })
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index()
  @ManyToOne(() => User, (u) => u.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Todo, (t) => t.category)
  todos: Todo[];
}
