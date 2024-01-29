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

  @ManyToOne(() => PointEntity, (point) => point.id)
  @JoinColumn({ name: 'originId' })
  originId: number;

  @ManyToOne(() => PointEntity)
  @JoinColumn({ name: 'destinyId' })
  destinyId: number;

  @Column('geography', {
    srid: 4326,
    nullable: true,
    spatialFeatureType: 'LineString',
  })
  line: LineString;

  @ManyToOne(() => GraphEntity, (graph) => graph.id)
  @JoinColumn({ name: 'graphId' })
  graphId: number;
}
