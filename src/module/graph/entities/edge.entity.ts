import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PointEntity } from './point.entity';
import { LineString } from 'geojson';
import { GraphEntity } from './graph.entity';

@Entity({
  name: 'edges',
})
export class EdgeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => PointEntity)
  @JoinColumn({ name: 'origin' })
  origin: PointEntity;

  @ManyToOne(() => PointEntity)
  @JoinColumn({ name: 'destiny' })
  destiny: PointEntity;

  @Column('geography', {
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'LineString',
  })
  line: LineString;

  @Column()
  distance: number;

  @ManyToOne(() => GraphEntity)
  @JoinColumn({ name: 'graph' })
  graph: GraphEntity;
}
