import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'logs',
})
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  //request.ip

  @Column({ name: 'requestIp', nullable: true })
  ip: string;
}
