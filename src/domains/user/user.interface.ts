import { IUser, UserRole, UserStatus } from "../../entities/User";

export interface IGetAllUserQueryParams {
  username?: string;
  fullname?: string;
  email?: string;
  deleted?: boolean;
  status?: UserStatus;
  role?: UserRole;
}

export interface IUserRequest {
  username: string;
  password?: string;
  fullname: string;
  email: string;
  status: UserStatus;
  role: UserRole;
}

export interface ICreateUserRequest extends IUserRequest {
  password: string;
}

export interface IUserPayload extends IUserRequest {
  createdBy?: IUser;
  createdAt?: Date;
  updatedBy?: IUser;
  updatedAt?: Date;
}
