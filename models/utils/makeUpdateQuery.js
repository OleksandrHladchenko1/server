exports.makeUpdateQuery = values => {
  const query = [];
  const params = [];

  Object.keys(values).forEach((key, index) => {
    query.push(`${key} = $${index + 1}`);
    params.push(values[key]);
  });

  return { query: query.join(', '), params };
};
