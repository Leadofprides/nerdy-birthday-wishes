import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('text')
  username: string;

  @Column('text')
  password: string;
}
