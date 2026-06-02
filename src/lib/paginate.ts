export interface PaginatedResult<T> {
  items: T[];
  total: number;
  pages: number;
  page: number;
  pageSize: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize = 12
): PaginatedResult<T> {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    pages,
    page: safePage,
    pageSize,
  };
}
