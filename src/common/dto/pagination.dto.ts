import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export interface IPagination {
  limit?: number;
  page?: number;
}

export class Pagination implements IPagination {
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit?: number = 100;

  @IsOptional()
  @Min(0)
  page?: number = 0;

  constructor(arg?: IPagination) {
    this.page = arg?.page;
    this.limit = arg?.limit;
  }
}
