import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Wishes {
  @PrimaryGeneratedColumn('uuid')
  wishes_uuid: string;

  @Column({ type: 'text' })
  wishes_body: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  request_received_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  computation_started_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  computation_finished_at: Date;

  @Column({ nullable: true })
  pow_nonce: number;

  @Column({ nullable: true })
  done_by_worker_id: number;
}
