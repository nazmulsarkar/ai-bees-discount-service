import { IsArray, IsEmail, IsOptional } from 'class-validator';

import { Role } from '../../common/enums/role.enum';

export class SignUpDTO {
  @IsEmail()
  email: string;
}

export class SignUp extends SignUpDTO {
  @IsOptional()
  @IsArray()
  roles: Role[] = [Role.User];
}
