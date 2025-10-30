import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Todo } from './todo.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'username', type: 'varchar', unique: true, length: 100 })
  username: string;

  @Column({ name: 'email', type: 'varchar', unique: true, length: 191 })
  email: string;

  @Column({ name: 'password', type: 'varchar', unique: true, length: 100 })
  password: string;

  @OneToMany(() => Category, (c) => c.user)
  categories: Category[];

  @OneToMany(() => Todo, (t) => t.user)
  todos: Todo[];
}
