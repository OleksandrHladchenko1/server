const { databaseMock } = require('../../tests/__mocks__');

const Event = require('../Event');

describe('Event model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should insert a new event into the database', async () => {
      const mockEventData = { lot_id: 1, start_time: '2024-10-02T10:00:00Z' };
      const mockResponse = { rows: [{ id: 1, ...mockEventData }] };

      databaseMock.query.mockResolvedValue(mockResponse);

      const event = new Event(mockEventData);
      const result = await event.save();

      expect(databaseMock.query).toHaveBeenCalledWith(
        'INSERT INTO events (lot_id, start_time) VALUES ($1, $2) RETURNING *',
        [mockEventData.lot_id, mockEventData.start_time]
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAll method', () => {
    it('should get all events with lots', async () => {
      const mockQuery = { sort: 'id' };
      const mockResponse = { rows: [{ id: 1, start_time: '2024-10-02T10:00:00Z' }] };

      databaseMock.query.mockResolvedValue(mockResponse);

      const result = await Event.getAll(mockQuery);

      expect(databaseMock.query).toHaveBeenCalledWith(`
      SELECT
        e.id,
        e.start_time,
        e.end_time,
        e.final_bid,
        e.status,
        json_build_object(
          'id', l.id,
          'title', l.title,
          'starting_bid', l.starting_bid,
          'increment', l.increment,
          'percent_for_me', l.percent_for_me
        ) AS lot
      FROM events e
      INNER JOIN lots l on e.lot_id = l.id
      ORDER BY id ASC
    `);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById method', () => {
    it('should get event details by ID', async () => {
      const mockEventId = 1;
      const mockResponse = { rows: [{ id: 1, start_time: '2024-10-02T10:00:00Z' }] };

      databaseMock.query.mockResolvedValue(mockResponse);

      const result = await Event.getById(mockEventId);

      expect(databaseMock.query).toHaveBeenCalledWith(`
      SELECT
        e.id,
        e.start_time,
        e.end_time,
        e.final_bid,
        e.status,
        json_build_object(
              'id', l.id,
              'title', l.title,
          'description', l.description,
          'starting_bid', l.starting_bid,
          'increment', l.increment,
          'percent_for_me', l.percent_for_me,
          'status', l.status
          ) AS lot,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as seller,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as category
      FROM events e
      INNER JOIN lots l ON e.lot_id = l.id
      INNER JOIN users u ON l.seller_id = u.id
      INNER JOIN categories c ON l.category_id = c.id
      WHERE e.id = $1
    `, [mockEventId]);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('editData method', () => {
    it('should update event data', async () => {
      const mockValues = { status: 'completed' };
      const mockEventId = 1;
      const mockResponse = { rows: [{ id: 1, status: 'completed' }] };

      databaseMock.query.mockResolvedValue(mockResponse);

      const result = await Event.editData(mockValues, mockEventId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        'UPDATE events SET status = $1 WHERE id = $2 RETURNING *',
        ['completed', mockEventId]
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete method', () => {
    it('should delete an event by ID', async () => {
      const mockEventId = 1;
      const mockResponse = { rowCount: 1 };

      databaseMock.query.mockResolvedValue(mockResponse);

      const result = await Event.delete(mockEventId);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM events WHERE id = $1', [mockEventId]);
      expect(result).toEqual(mockResponse);
    });
  });
});
