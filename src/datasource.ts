import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LogEntity } from './entities/log.entity';
import { GraphEntity } from './entities/graph.entity';
import { EdgeEntity } from './entities/edge.entity';
import { PointEntity } from './entities/point.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: [UserEntity, LogEntity, GraphEntity, EdgeEntity, PointEntity],
  migrations: [],
  migrationsTableName: 'typeorm_migrations',
  logging: false, // new DatabaseLogger()
  synchronize: false, // don't use TRUE in production!
  migrationsRun: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
} as DataSourceOptions;
const datasource = new DataSource(config);
datasource.initialize();
export default datasource;
