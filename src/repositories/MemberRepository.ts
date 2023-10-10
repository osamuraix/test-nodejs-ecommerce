import { Service } from "typedi";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../database/mysql/AppDataSource";

@Service()
export class MemberRepository extends Repository<User> {
  async createMember(request: {}) {
    return AppDataSource.getRepository(User).save(request);
  }

  async updateMember(condition: {}, request: {}) {
    return AppDataSource.getRepository(User).update(condition, request);
  }
}
