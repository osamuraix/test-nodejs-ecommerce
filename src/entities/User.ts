import { Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

export enum UserStatus {
  PENDING = "pending",
  ACTIVE = "active",
}

export enum UserRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export interface IUser {
  userId: number;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedBy?: string;
  deletedAt?: Date;
  deleted: boolean;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: true, update: false })
  @Exclude()
  password?: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  fullname!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar?: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @Column({ type: "enum", enum: UserRole, default: UserRole.MEMBER })
  role!: UserRole;

  @ManyToOne(() => User, (user) => user.username)
  createdBy?: string;

  @Column({ type: "datetime", nullable: true })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.username)
  updatedBy?: string;

  @Column({ type: "datetime", nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.username)
  deletedBy?: string;

  @Column({ type: "datetime", nullable: true })
  deletedAt?: Date;

  @Column({ type: "boolean", default: false })
  @Exclude()
  deleted!: boolean;
}
