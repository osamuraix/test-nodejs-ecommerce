import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  IGetAllUserQueryParams,
  ICreateUserRequest,
  IUserRequest,
} from "../domains/user/user.interface";
import { UserRole, UserStatus } from "../entities/User";

export class GetAllUserQueryParams implements IGetAllUserQueryParams {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}

export class UserRequest implements IUserRequest {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  fullname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status!: UserStatus;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}

export class CreateUserRequest
  extends UserRequest
  implements ICreateUserRequest
{
  @IsNotEmpty()
  @IsString()
  password!: string;
}
