import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

import { Role } from '../../common/enums/role.enum';

export class SignUpDTO {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class SignUp extends SignUpDTO {
  @IsOptional()
  @IsArray()
  roles: Role[] = [Role.User];
}
