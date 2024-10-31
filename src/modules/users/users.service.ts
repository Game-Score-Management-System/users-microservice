import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  getAllUsers() {
    return {
      users: [
        {
          id: 1,
          name: 'John Doe',
        },
      ],
    };
  }

  getUserProfileById() {}

  updateProfile() {}

  getUserScores() {}

  removeUser() {}
}
