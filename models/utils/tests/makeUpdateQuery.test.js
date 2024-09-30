const { makeUpdateQuery } = require('../makeUpdateQuery');

describe('makeUpdateQuery method', () => {
  it('should create a valid update query and params for a given object', () => {
    const values = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
    };

    const result = makeUpdateQuery(values);

    expect(result.query).toBe('first_name = $1, last_name = $2, age = $3');
    expect(result.params).toEqual(['John', 'Doe', 30]);
  });

  it('should return an empty query and params for an empty object', () => {
    const values = {};

    const result = makeUpdateQuery(values);

    expect(result.query).toBe('');
    expect(result.params).toEqual([]);
  });
});
