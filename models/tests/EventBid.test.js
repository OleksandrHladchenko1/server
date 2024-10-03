const { databaseMock } = require('../../tests/__mocks__');

const EventBid = require('../EventBid');

describe('EventBid model', () => {
  const mockEventBidData = {
    event_id: 1,
    user_id: 2,
    bid_amount: 500,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should insert a new event bid into the database', async () => {
      const expectedResponse = { rows: [{ id: 1, ...mockEventBidData }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const eventBid = new EventBid(mockEventBidData);
      const result = await eventBid.save();

      expect(databaseMock.query).toHaveBeenCalledWith(
        'INSERT INTO event_bids (event_id, user_id, bid_amount) VALUES ($1, $2, $3) RETURNING *',
        [mockEventBidData.event_id, mockEventBidData.user_id, mockEventBidData.bid_amount]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getAllEventBids method', () => {
    it('should retrieve all event bids for a given event ID', async () => {
      const eventId = 1;
      const expectedResponse = {
        rows: [
          { id: 1, bid_amount: 500, user: { id: 2, first_name: 'John', last_name: 'Doe' } },
        ],
      };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await EventBid.getAllEventBids({}, eventId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        `
      SELECT 
        b.id,
        b.bid_amount,
        b.created_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as user
      FROM event_bids b
      INNER JOIN users u ON b.user_id = u.id
      WHERE event_id = $1
      ORDER BY id ASC
    `,
        [eventId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getEventBidById method', () => {
    it('should retrieve an event bid by its ID', async () => {
      const bidId = 1;
      const expectedResponse = {
        rows: [
          {
            id: 1,
            bid_amount: 500,
            user: { id: 2, first_name: 'John', last_name: 'Doe' },
          },
        ],
      };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await EventBid.getEventBidById(bidId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        `
      SELECT 
        b.id,
        b.bid_amount,
        b.created_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as user
      FROM event_bids b
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `,
        [bidId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('editEventBidData method', () => {
    it('should update event bid data and return the updated row', async () => {
      const bidId = 1;
      const updatedValues = { bid_amount: 600 };
      const expectedResponse = { rows: [{ id: 1, bid_amount: 600 }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await EventBid.editEventBidData(updatedValues, bidId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        'UPDATE event_bids SET bid_amount = $1 WHERE id = $2 RETURNING *',
        [updatedValues.bid_amount, bidId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteEventBid method', () => {
    it('should delete an event bid by its ID', async () => {
      const bidId = 1;
      const expectedResponse = { rowCount: 1 };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await EventBid.deleteEventBid(bidId);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM event_bids WHERE id = $1', [bidId]);
      expect(result).toEqual(expectedResponse);
    });
  });
});
