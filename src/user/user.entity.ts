import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id?: ObjectId;

  @Column()
  username: string;

  @Column()
  password: string;
}
