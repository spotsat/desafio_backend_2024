import { Module, forwardRef } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphEntity } from '../../entities/graph.entity';
import { EdgeEntity } from '../../entities/edge.entity';
import { PointEntity } from '../../entities/point.entity';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GraphEntity, EdgeEntity, PointEntity]),
    forwardRef(() => LogModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [GraphController],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
