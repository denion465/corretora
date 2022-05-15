/* eslint-disable indent */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('quotes_data')
export class QuoteData {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 20, nullable: false })
  symbol: string;

  @Column('jsonb', { nullable: false })
  data: object;

  @UpdateDateColumn()
  updated_at: Date;
}
