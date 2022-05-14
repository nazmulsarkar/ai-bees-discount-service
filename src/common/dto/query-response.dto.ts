import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export interface IQueryResponse<T> {
  success: boolean;
  data: T[];
  totalCount?: number;
}

export class QueryResponse<T> implements IQueryResponse<T> {
  @IsBoolean()
  success = true;

  @IsArray()
  data: T[] = [];

  @IsNumber()
  totalCount?: number = 0;

  constructor(arg?: IQueryResponse<T>) {
    this.success = arg?.success;
    this.data = arg?.data;
    this.totalCount = arg?.totalCount;
  }
}
