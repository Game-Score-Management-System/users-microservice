import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import {
  GetUserProfileByIdRequest,
  LoginRequest,
  RegisterPlayerRequest,
  RemoveUserRequest,
  UpdateProfileRequest,
  UpdateUserStatusRequest
} from '../../common/interfaces/user.interface';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { compare, hash } from 'bcryptjs';
import { roles } from 'src/common/interfaces/role.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async registerPlayer(data: RegisterPlayerRequest) {
    const { email, lastname, name, password } = data;
    const username = `@${email.split('@').at(0)}`;

    try {
      const userExists = await this.prismaService.user.findUnique({ where: { email } });

      if (userExists) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'User already exists, please login'
        });
      }

      const passwordHash = await hash(password, 10);

      const newUser = await this.prismaService.user.create({
        data: {
          username,
          email,
          lastname,
          name,
          password: passwordHash,
          role: roles.PLAYER,
          profilePicture: `https://robohash.org/${name}`
        }
      });

      const { password: _, ...userWithoutPassword } = newUser;

      return userWithoutPassword;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: `Failed to register user: ${error.message}`
      });
    }
  }

  async login(data: LoginRequest) {
    const { email, password } = data;

    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found, please register'
      });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid credentials'
      });
    }

    return user;
  }

  async getAllUsers(paginationDto: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const total = await this.prismaService.user.count();

    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return {
      data: users,
      metadata: {
        limit,
        page,
        totalItems: total,
        totalPages: Math.ceil(total / limit)
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
