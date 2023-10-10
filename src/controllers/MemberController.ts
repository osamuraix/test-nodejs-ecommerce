import { Service } from "typedi";
import {
  JsonController,
  Post,
  Body,
  Get,
  UseBefore,
  CurrentUser,
  Put,
} from "routing-controllers";
import { config } from "dotenv";
import { MemberRequest } from "./MemberController.dto";
import { getSessionMiddleware } from "../middlewares/authMiddleware";
import { MemberDomain } from "../domains/member/member.domain";
import { IUser } from "../entities/User";

config();

@Service()
@JsonController("/v1/member")
export class MemberController {
  constructor(private memberDomain: MemberDomain) {}

  @Get("/")
  @UseBefore(getSessionMiddleware)
  async getMember(@CurrentUser() user: IUser) {
    const { userId } = user;
    return this.memberDomain.getMember(userId);
  }

  @Put("/")
  @UseBefore(getSessionMiddleware)
  async updateMember(@CurrentUser() user: IUser, @Body() request: {}) {
    return this.memberDomain.updateMember(user, request);
  }

  @Post("/sign-up")
  async signUp(@Body() request: MemberRequest) {
    return this.memberDomain.signUp(request);
  }

  @Post("/sign-in")
  async signIn(@Body() credentials: { username: string; password: string }) {
    return this.memberDomain.signIn(credentials.username, credentials.password);
  }
}
