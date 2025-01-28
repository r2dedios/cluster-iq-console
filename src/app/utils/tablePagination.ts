export function getPaginatedSlice<T>(data: T[], page: number, perPage: number): T[] {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  return data.slice(startIndex, endIndex);
}
