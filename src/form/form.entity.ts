import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class FormEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  Info: string;

  @Column()
  Info2: string;
}
