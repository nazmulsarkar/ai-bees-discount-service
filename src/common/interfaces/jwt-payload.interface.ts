import { Types } from 'mongoose';
import { Role } from '../enums/role.enum';

export interface JwtPayload {
  _id: Types.ObjectId;
  email: string;
  roles: Role[];
  firstName: string;
  lastName: string;
  displayName: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  lastLoginTime?: Date;
  loginCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
