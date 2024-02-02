import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'graph',
})
export class GraphEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
