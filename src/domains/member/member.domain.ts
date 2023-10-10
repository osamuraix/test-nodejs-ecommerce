import i18n from "i18next";
import { Service } from "typedi";
import { CustomError } from "../../middlewares/CustomError";
import { IUser, UserRole, UserStatus } from "../../entities/User";
import { MemberRepository } from "../../repositories/MemberRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { IMemberRequest } from "./member.interface";
import { generateToken } from "../../middlewares/authMiddleware";
import { UnAuthorizedError } from "../../middlewares/UnAuthorizedError";
import { NotFoundError } from "routing-controllers";

@Service()
export class MemberDomain {
  constructor(
    private memberRepo: MemberRepository,
    private userRepo: UserRepository
  ) {}

  async getMember(userId: number) {
    const data = await this.userRepo.findOneBy({ userId, deleted: false });

    if (!data) {
      throw new NotFoundError(i18n.t(`member.error.user_not_found`));
    }

    return data;
  }

  async signUp(request: IMemberRequest) {
    try {
      const payload = {
        ...request,
        status: UserStatus.PENDING,
        role: UserRole.MEMBER,
        createdAt: new Date(),
      };

      await this.memberRepo.createMember(payload);

      return {
        message: i18n.t(`member.message.sign_up_success`),
      };
    } catch (err) {
      throw err;
    }
  }

  async signIn(username: string, password: string) {
    try {
      const options = {
        role: UserRole.MEMBER,
      };

      const user = await this.userRepo.findOneBy({
        username,
        password,
        ...options,
      });

      if (!user) {
        throw new UnAuthorizedError(i18n.t(`system.error.unauthorized`));
      }

      if (user?.status === UserStatus.PENDING) {
        throw new CustomError(
          i18n.t(`member.error.status_should_active`),
          "MEMBER_UN_ACTIVE"
        );
      }

      const token = generateToken(user);
      return { token };
    } catch (err) {
      throw err;
    }
  }

  async updateMember(user: IUser, request: {}) {
    try {
      const { userId } = user;
      const member = await this.userRepo.findOneBy({ userId, deleted: false });

      if (!member) {
        throw new NotFoundError(i18n.t(`member.error.user_not_found`));
      }

      await this.memberRepo.updateMember(
        { userId },
        {
          ...request,
          updatedBy: user,
          updatedAt: new Date(),
        }
      );

      return {
        message: i18n.t(`member.message.update_member_success`),
      };
    } catch (err) {
      throw err;
    }
  }
}
