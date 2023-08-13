import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Wishes {
  @PrimaryColumn('text')
  wishes_uuid: string;

  @Column({ type: 'json' })
  wishes_body: object;

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

  @Column({ type: 'text', nullable: true })
  hash: string;
}
