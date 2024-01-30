import {
  Column,
  Entity,
  Geography,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GraphEntity } from './graph.entity';

@Entity({
  name: 'points',
})
export class PointEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('geography', {
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'Point',
  })
  location: Geography;

  @ManyToOne(() => GraphEntity)
  @JoinColumn({ name: 'graph' })
  graph: GraphEntity;
}
