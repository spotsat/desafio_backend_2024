import {
  Column,
  Entity,
  Geography,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { GraphEntity } from './graph.entity';

@Entity({
  name: 'points',
})
export class PointEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column('geography', {
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'Point',
  })
  location: Geography;

  @ManyToOne(() => GraphEntity, (graph) => graph.id)
  @JoinColumn({ name: 'graphId' })
  graphId: number;
}
