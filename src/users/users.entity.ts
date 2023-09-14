import {
  BaseEntity,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

import { IsEmail, IsOptional, IsDefined } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

import * as bcrypt from 'bcryptjs';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  fullname: string;

  @IsOptional({ groups: [UPDATE] })
  @IsDefined({ groups: [CREATE] })
  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email address' })
  username: string;

  @Exclude({ toPlainOnly: true }) // Exclude the password field during serialization
  @Column()
  @Column({ select: false })
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;

  @BeforeInsert()
  @AfterLoad()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const rounds = 8;
      this.password = await bcrypt.hash(this.password, rounds);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
