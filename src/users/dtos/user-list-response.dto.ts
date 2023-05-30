import { Pagination } from 'src/shared/dtos/pagnation-response.dto';
import { User } from '../entities/users.entity';

export interface UserListResponse extends Pagination {
  data: User[];
}
