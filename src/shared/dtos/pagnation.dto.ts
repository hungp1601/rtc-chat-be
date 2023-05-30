import { IsInt, Min } from 'class-validator';

export class PaginationPayload {
  page: number;

  pageSize: number;
}
