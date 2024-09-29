const { makeOrderByQuery } = require('../makeOrderByQuery');

const validSortColumns = ['id', 'name'];

describe('makeOrderByQuery function', () => {
  it('should return default sort column and order', () => {
    const query = makeOrderByQuery({}, validSortColumns);

    expect(query).toEqual('ORDER BY id ASC');
  });

  it('should return provided sort column and order', () => {
    const query = makeOrderByQuery({ orderBy: 'name', sortOrder: 'desc' }, validSortColumns);

    expect(query).toEqual('ORDER BY name DESC');
  });
  
  it('should throw an error when orderBy param is invalid', () => {
    const result = () => makeOrderByQuery({ orderBy: 'INVALID', sortOrder: 'desc' }, validSortColumns);
    expect(result).toThrow('Невалидный столбец для сортировки: INVALID');
  });

  it('should throw an error when sortOrder param is invalid', () => {
    const result = () => makeOrderByQuery({ orderBy: 'name', sortOrder: 'INVALID' }, validSortColumns);
    expect(result).toThrow('Невалидный порядок сортировки: INVALID');
  });
});