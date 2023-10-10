import i18n from "i18next";
import { Service } from "typedi";
import {
  JsonController,
  Get,
  Param,
  // QueryParams,
  QueryParam,
  Post,
  Body,
  UseBefore,
  Ctx,
  CurrentUser,
  Put,
  Delete,
} from "routing-controllers";
import { Context } from "koa";
import { config } from "dotenv";
import {
  CreateUserRequest,
  GetAllUserQueryParams,
  UserRequest,
} from "./UserController.dto";
import {
  generateToken,
  getSessionMiddleware,
} from "../middlewares/authMiddleware";
import { IUser, UserRole, UserStatus } from "../entities/User";
import { UnAuthorizedError } from "../middlewares/UnAuthorizedError";
import { UserDomain } from "../domains/user/user.domain";

config();

@Service()
@JsonController("/v1/users")
export class UserController {
  constructor(private userDomain: UserDomain) {}

  private validateRoleAdmin(user: IUser) {
    const { userId, role } = user;

    if (role !== UserRole.ADMIN) {
      throw new UnAuthorizedError(i18n.t(`system.error.unauthorized`));
    }
  }

  @Post("/login")
  async login(
    @Ctx() ctx: Context,
    @Body() credentials: { username: string; password: string }
  ) {
    const options = {
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    };

    const user = await this.userDomain.login(
      credentials.username,
      credentials.password,
      options
    );

    if (!user) {
      ctx.response.status = 401;
      return { error: "Unauthorized" };
    }

    const token = generateToken(user);
    return { token };
  }

  @Get("/session")
  @UseBefore(getSessionMiddleware)
  async getSession(@CurrentUser() user: IUser): Promise<IUser> {
    return user;
  }

  @Get("/")
  getAllUsers(
    @QueryParam("username") username: string,
    @QueryParam("fullname") fullname: string,
    @QueryParam("email") email: string,
    @QueryParam("deleted") deleted: boolean
    // @QueryParams() query: GetAllUserQueryParams
  ): Promise<IUser[]> {
    const query: GetAllUserQueryParams = {
      username,
      fullname,
      email,
      deleted,
    };

    return this.userDomain.findAll(query);
  }

  @Get("/:userId")
  getUser(@Param("userId") userId: number): Promise<IUser> {
    return this.userDomain.findByUserId(userId);
  }

  @Post("/")
  @UseBefore(getSessionMiddleware)
  async createUser(
    @CurrentUser() user: IUser,
    @Body() request: CreateUserRequest
  ) {
    this.validateRoleAdmin(user);

    return this.userDomain.createUser(user, request);
  }

  @Put("/")
  @UseBefore(getSessionMiddleware)
  async updateUser(@CurrentUser() user: IUser, @Body() request: UserRequest) {
    this.validateRoleAdmin(user);

    return this.userDomain.updateUser(user, request);
  }

  @Delete("/:userId")
  @UseBefore(getSessionMiddleware)
  async deleteUser(
    @CurrentUser() user: IUser,
    @Param("userId") userId: number
  ) {
    this.validateRoleAdmin(user);

    return this.userDomain.deleteUser(user, userId);
  }
}
