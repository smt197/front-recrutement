import { Application } from './application';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class PaginatedApplicationResponseDto {
  constructor(
    public applications: Application[],
    public total: number,
    public page: number,
    public limit: number
  ) {}
}
