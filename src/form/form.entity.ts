import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Form {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'json' })
  data: any;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
