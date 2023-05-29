import { IsInt, Min } from 'class-validator';

export class PaginationPayload {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  pageSize: number;
}
