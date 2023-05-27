import { Address } from 'src/address/address.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'clients' })
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column()
  fullname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  validated: boolean;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
