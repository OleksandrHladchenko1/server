const validSortOrders = ['ASC', 'DESC'];

exports.makeOrderByQuery = (query, validSortColumns) => {
  const { orderBy = 'id', sortOrder = 'ASC' } = query;

  if (!validSortColumns.includes(orderBy)) {
    throw new Error(`Невалидный столбец для сортировки: ${orderBy}`);
  }

  if (!validSortOrders.includes(sortOrder.toUpperCase())) {
    throw new Error(`Невалидный порядок сортировки: ${sortOrder}`);
  }

  return `ORDER BY ${orderBy} ${sortOrder.toUpperCase()}`;
};
