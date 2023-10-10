import i18n from "i18next";
import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { IUser } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import {
  ICreateUserRequest,
  IGetAllUserQueryParams,
  IUserPayload,
  IUserRequest,
} from "./user.interface";

@Service()
export class UserDomain {
  constructor(private userRepo: UserRepository) {}

  async findAll(query: IGetAllUserQueryParams): Promise<IUser[]> {
    return this.userRepo.findAll({ where: { ...query, deleted: false } });
  }

  async findByUserId(userId: number) {
    const data = await this.userRepo.findOneBy({ userId, deleted: false });

    if (!data) {
      throw new NotFoundError(i18n.t(`user.error.user_not_found`));
    }

    return data;
  }

  async login(
    username: string,
    password: string,
    options: {}
  ): Promise<IUser | null> {
    const user = await this.userRepo.findOneBy({
      username,
      password,
      ...options,
    });
    return user;
  }

  async createUser(user: IUser, request: ICreateUserRequest) {
    try {
      const payload: IUserPayload = {
        ...request,
        createdBy: user,
        createdAt: new Date(),
      };

      await this.userRepo.upsertUser(payload);

      return {
        message: i18n.t(`user.message.create_user_success`),
      };
    } catch (err) {
      throw err;
    }
  }

  async updateUser(user: IUser, request: IUserRequest) {
    try {
      const payload: IUserPayload = {
        ...request,
        updatedBy: user,
        updatedAt: new Date(),
      };

      await this.userRepo.upsertUser(payload);

      return {
        message: i18n.t(`user.message.update_user_success`),
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(user: IUser, userId: number) {
    const data = await this.userRepo.findOneBy({ userId, deleted: false });

    if (!data) {
      throw new NotFoundError(i18n.t(`user.error.user_not_found`));
    }

    await this.userRepo.deleteUser(
      { userId },
      {
        deletedBy: user,
        deletedAt: new Date(),
        deleted: true,
      }
    );

    return {
      message: i18n.t(`user.message.delete_user_success`),
    };
  }
}
