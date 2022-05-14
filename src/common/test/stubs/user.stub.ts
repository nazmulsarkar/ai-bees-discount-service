import { Types } from 'mongoose';
import { User } from '../../../entities/user.entity';
import { Role } from '../../enums/role.enum';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

export const userStub = (): JwtPayload => ({
  _id: new Types.ObjectId('6103df18d2631a1d0cb8fdda'),
  email: 'test@yopmail.com',
  roles: [Role.User],
  firstName: 'string',
  lastName: 'string',
  displayName: 'string',
});

export const userResponseStub = (): User => ({
  ...new User(),
  ...userStub(),
  isEmailVerified: true,
  password: `$argon2i$v=19$m=4096,t=3,p=1$4euip9j022hhZRU/za2qQw$wP4D/fPrU4utD0PqoEJNgJZL6uQ5JXj7IPTLKNTqZ5A`,
});
