// eslint-disable-next-line import/no-cycle
import { PollOption } from './PollOption.js';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('text', { nullable: false })
  public title!: string;

  @Column('text', { nullable: false })
  public description!: string;

  @Column('text', { nullable: false })
  public owner!: string;

  @Column('boolean', {
    default: true,
    nullable: false,
  })
  public anonymous!: boolean;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  public multiple!: boolean;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  public open!: boolean;

  @Column('text', { array: true, default: [], nullable: false })
  public roles!: string[];

  @Column('float', { default: 0.5, nullable: false })
  public threshold!: number;

  @Column('text', { nullable: true })
  public decision?: string;

  @Column('boolean', {
    default: false,
    nullable: false,
  })
  public done!: boolean;

  @OneToMany(() => PollOption, (option) => option.poll, {
    cascade: true,
    nullable: false,
  })
  public options!: Array<Relation<PollOption>>;
}
