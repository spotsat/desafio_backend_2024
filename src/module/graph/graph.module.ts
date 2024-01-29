import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphEntity } from './entities/graph.entity';
import { EdgeEntity } from './entities/edge.entity';
import { PointEntity } from './entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GraphEntity, EdgeEntity, PointEntity])],
  controllers: [GraphController],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
