import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import {
  GetAllUsersResponse,
  GetUserProfileByIdRequest,
  GetUserProfileByIdResponse,
  LoginRequest,
  LoginResponse,
  RegisterPlayerRequest,
  RegisterPlayerResponse,
  RemoveUserRequest,
  RemoveUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse
} from './user.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'Login')
  async login(requestData: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.login(requestData);
    return {
      user
    };
  }

  @GrpcMethod('UserService', 'RegisterPlayer')
  async registerPlayer(requestData: RegisterPlayerRequest): Promise<RegisterPlayerResponse> {
    const user = await this.usersService.registerPlayer(requestData);
    return {
      user
    };
  }

  @GrpcMethod('UserService', 'GetAllUsers')
  async getAllUsers(requestData: PaginationQueryDto): Promise<GetAllUsersResponse> {
    const { data, metadata } = await this.usersService.getAllUsers(requestData);
    return {
      users: data,
      metadata
    };
  }

  @GrpcMethod('UserService', 'GetUserProfileById')
  async getUserProfileById(
    requestData: GetUserProfileByIdRequest
  ): Promise<GetUserProfileByIdResponse> {
    const user = await this.usersService.getUserProfileById(requestData);
    return {
      user
    };
  }

  @GrpcMethod('UserService', 'UpdateProfile')
  async updateProfile(requestData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const user = await this.usersService.updateProfile(requestData);
    return {
      user
    };
  }

  @GrpcMethod('UserService', 'GetUserScores')
  getUserScores() {
    return this.usersService.getUserScores();
  }

  @GrpcMethod('UserService', 'UpdateUserStatus')
  async updateUserStatus(requestData: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
    const user = await this.usersService.updateUserStatus(requestData);
    return {
      user
    };
  }

  @GrpcMethod('UserService', 'RemoveUser')
  async removeUser(requestData: RemoveUserRequest): Promise<RemoveUserResponse> {
    await this.usersService.removeUser(requestData);
    return {};
  }
}
