import { Role } from 'src/modules/users/dto/create-user.dto';
import { Metadata } from './metadata.interface';

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  username: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
}

export interface Score {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPlayerRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface RegisterPlayerResponse {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface GetAllUsersRequest {
  page: number;
  limit: number;
}

export interface GetAllUsersResponse {
  users: User[];
  metadata: Metadata;
}

export interface GetUserProfileByIdRequest {
  id: string;
}

export interface GetUserProfileByIdResponse {
  user: User;
}

export interface UpdateProfileRequest {
  id: string;
  name?: string;
  lastname?: string;
  profilePicture?: string;
  username?: string;
}

export interface UpdateProfileResponse {
  user: User;
}

export interface GetUserScoresRequest {
  id: string;
  page: number;
  limit: number;
}

export interface GetUserScoresResponse {
  scores: Score[];
}

export interface RemoveUserRequest {
  id: string;
}

export interface UpdateUserRequest {
  id: string;
  status: boolean;
  role: Role;
}

export interface UpdateUserResponse {
  user: User;
}

export interface RemoveUserResponse {}
