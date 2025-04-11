export interface Job {
  id: number;
  title: string;
  description: string;
  experience: number;
  skills: string[];
  location: string;
  deadline: string;
  recruiterId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponseJob<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
