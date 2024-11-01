import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import {
  GetUserProfileByIdRequest,
  RemoveUserRequest,
  UpdateProfileRequest,
  UpdateUserStatusRequest
} from './user.interface';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(paginationDto: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const totalPages = await this.prismaService.user.count();

    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data: users,
      metadata: {
        limit,
        page,
        totalPages
      }
    };
  }

  async getUserProfileById(data: GetUserProfileByIdRequest) {
    const { id } = data;
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User with ID ${id} not found`
      });
    }

    return user;
  }

  async updateProfile(data: UpdateProfileRequest) {
    const { id, name, lastname, profilePicture } = data;

    try {
      const user = await this.prismaService.user.update({
        data: { name, lastname, profilePicture },
        where: { id }
      });

      return user;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: `Failed to update profile for user with ID ${id}`
      });
    }
  }

  getUserScores() {}

  async updateUserStatus(data: UpdateUserStatusRequest) {
    const { id, status: userStatus } = data;
    try {
      const user = await this.prismaService.user.update({
        data: { status: Boolean(userStatus) },
        where: { id }
      });

      return user;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: `Failed to switch status for user with ID ${id}`
      });
    }
  }

  async removeUser(data: RemoveUserRequest) {
    const { id } = data;
    try {
      await this.prismaService.user.update({
        data: { status: false },
        where: { id }
      });
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: `Failed to remove user with ID ${id}`
      });
    }
  }
}
