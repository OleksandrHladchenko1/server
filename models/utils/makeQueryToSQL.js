exports.makeQueryToSQL = query => {
  let sqlQueries = [];

  const direction = query.direction || 'ASC';
  const limit = query.limit || 10;

  if('orderBy' in query) sqlQueries.push(`ORDER BY ${query.orderBy} ${direction}`);
  
  if('limit' in query) sqlQueries.push(`LIMIT ${limit}`);

  return sqlQueries.join(' ');
};
