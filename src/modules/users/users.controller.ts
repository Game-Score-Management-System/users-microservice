import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'GetAllUsers')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @GrpcMethod('UserService', 'GetUserProfileById')
  getUserProfileById() {
    return this.usersService.getUserProfileById();
  }

  @GrpcMethod('UserService', 'UpdateProfile')
  updateProfile() {
    return this.usersService.updateProfile();
  }

  @GrpcMethod('UserService', 'GetUserScores')
  getUserScores() {
    return this.usersService.getUserScores();
  }

  @GrpcMethod('UserService', 'RemoveUser')
  removeUser() {
    return this.usersService.removeUser();
  }
}
