import * as Faker from "faker";
import { Service } from "typedi";
import { JsonController, Get } from "routing-controllers";
import { AppDataSource } from "../database/mysql/AppDataSource";
import { User, UserStatus } from "../entities/User";

@Service()
@JsonController("/v1/seeds")
export class SeedController {
  @Get("/users")
  async seedUsers() {
    const usersToSeed = 10;
    const userRepository = AppDataSource.getRepository(User);

    for (let i = 0; i < usersToSeed; i++) {
      const user = new User();
      user.username = Faker.internet.userName();
      user.password = "password";
      user.fullname = Faker.name.findName();
      user.email = Faker.internet.email();
      user.avatar = Faker.image.avatar();
      user.status = Faker.random.arrayElement(Object.values(UserStatus));
      user.createdAt = Faker.date.past();

      await userRepository.save(user);
    }

    return { message: `Seeded ${usersToSeed} users` };
  }
}
