const { databaseMock } = require('../../tests/__mocks__');

const Lot = require('../Lot');

describe('Lot model', () => {
  const mockLotData = {
    seller_id: 1,
    category_id: 2,
    title: 'Test Lot',
    description: 'Test description',
    starting_bid: 100,
    increment: 10,
    percent_for_me: 5,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should insert a new lot into the database', async () => {
      const expectedResponse = { rows: [{ id: 1, ...mockLotData }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const lot = new Lot(mockLotData);
      const result = await lot.save();

      expect(databaseMock.query).toHaveBeenCalledWith(
        'INSERT INTO lots (seller_id, category_id, title, description, starting_bid, increment, percent_for_me) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
          mockLotData.seller_id,
          mockLotData.category_id,
          mockLotData.title,
          mockLotData.description,
          mockLotData.starting_bid,
          mockLotData.increment,
          mockLotData.percent_for_me,
        ]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAll method', () => {
    it('should retrieve all lots from the database', async () => {
      const expectedResponse = { rows: [{ id: 1, title: 'Test Lot', starting_bid: 100 }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getAll({});

      expect(databaseMock.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getById method', () => {
    it('should retrieve a lot by its ID', async () => {
      const lotId = 1;
      const expectedResponse = {
        rows: [{ id: lotId, title: 'Test Lot', description: 'Test description' }],
      };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getById(lotId);

      expect(databaseMock.query).toHaveBeenCalledWith(expect.stringContaining('WHERE l.id = $1'), [lotId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getByUserId method', () => {
    it('should retrieve lots by user ID', async () => {
      const userId = 1;
      const expectedResponse = { rows: [{ id: 1, title: 'Test Lot' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getByUserId(userId);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM lots WHERE seller_id = $1', [userId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getByStatus method', () => {
    it('should retrieve lots by status', async () => {
      const status = 'active';
      const expectedResponse = { rows: [{ id: 1, title: 'Active Lot', status: 'active' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getByStatus(status);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM lots WHERE status = $1', [status]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getByCategory method', () => {
    it('should retrieve lots by category ID', async () => {
      const categoryId = 2;
      const expectedResponse = { rows: [{ id: 1, title: 'Category Lot', category_id: 2 }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getByCategory(categoryId);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM lots WHERE category_id = $1', [categoryId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getByTitle method', () => {
    it('should retrieve lots by title (case insensitive)', async () => {
      const title = 'Test';
      const formattedTitle = `%${title}%`;
      const expectedResponse = { rows: [{ id: 1, title: 'Test Lot' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.getByTitle(title);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM lots WHERE title ILIKE $1', [formattedTitle]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('editData method', () => {
    it('should update lot data and return the updated row', async () => {
      const lotId = 1;
      const updatedValues = { title: 'Updated Title' };
      const expectedResponse = { rows: [{ id: lotId, title: 'Updated Title' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.editData(updatedValues, lotId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        'UPDATE lots SET title = $1 WHERE id = $2 RETURNING *',
        [updatedValues.title, lotId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete methoc', () => {
    it('should delete a lot by its ID', async () => {
      const lotId = 1;
      const expectedResponse = { rowCount: 1 };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Lot.delete(lotId);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM lots WHERE id = $1', [lotId]);
      expect(result).toEqual(expectedResponse);
    });
  });
});
