import { IsString } from 'class-validator';
import { BaseUserDTO } from '../../users/dto/base-user.dto';

export class UserAuthDto extends BaseUserDTO {
  @IsString()
  readonly orderRef: string;
}
