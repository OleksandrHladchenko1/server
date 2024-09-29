exports.makeUpdateQuery = values => {
  let query = [];
  let params = [];

  Object.keys(values).forEach((key, index) => {
    query.push(`${key} = $${index + 1}`);
    params.push(values[key]);
  });

  return { query: query.join(', '), params };
};
