import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { GraphModule } from './module/graph/graph.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserEntity } from './module/user/entity/user.entity';
import { GraphEntity } from './module/graph/entities/graph.entity';
import { EdgeEntity } from './module/graph/entities/edge.entity';
import { PointEntity } from './module/graph/entities/point.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      limit: 10,
      ttl: 60,
    }),
    forwardRef(() => UserModule),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_URL,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      entities: [UserEntity, GraphEntity, EdgeEntity, PointEntity],
    }),
    UserModule,
    GraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
