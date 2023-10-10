import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { IMemberRequest } from "../domains/member/member.interface";

export class MemberRequest implements IMemberRequest {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  fullname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
