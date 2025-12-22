interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

export async function fetchAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>,
  pageSize: number = 100
): Promise<T[]> {
  const allItems: T[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage(currentPage, pageSize);
    allItems.push(...response.items);

    hasMore = response.items.length === pageSize;
    currentPage++;
  }

  return allItems;
}
