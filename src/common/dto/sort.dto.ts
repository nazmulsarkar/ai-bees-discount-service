import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SortDirection } from '../enums/SortDirection.enum';

export class SortDTO {
  @IsNotEmpty()
  @IsString()
  property = 'createdAt';

  @IsNotEmpty()
  @IsNumber()
  direction: SortDirection = SortDirection.DESC;
}
