const { databaseMock } = require('../../tests/__mocks__');

const Participant = require('../Participant');

describe('Participant model', () => {
  const mockParticipantData = { user_id: 1, event_id: 2 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should insert a new participant into the database', async () => {
      const expectedResponse = { rows: [{ id: 1, ...mockParticipantData }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const participant = new Participant(mockParticipantData);
      const result = await participant.save();

      expect(databaseMock.query).toHaveBeenCalledWith(
        'INSERT INTO participants (user_id, event_id) VALUES ($1, $2) RETURNING *',
        [mockParticipantData.user_id, mockParticipantData.event_id]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getEventParticipants method', () => {
    it('should retrieve participants for a specific event', async () => {
      const eventId = 2;
      const expectedResponse = { rows: [{ id: 1, join_date: '2023-01-01' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Participant.getEventParticipants({}, eventId);

      expect(databaseMock.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [eventId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getById method', () => {
    it('should retrieve a participant by its ID', async () => {
      const participantId = 1;
      const expectedResponse = { rows: [{ id: participantId, join_date: '2023-01-01' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Participant.getById(participantId);

      expect(databaseMock.query).toHaveBeenCalledWith(expect.stringContaining('WHERE p.id = $1'), [participantId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('editData method', () => {
    it('should update participant data and return the updated row', async () => {
      const participantId = 1;
      const updatedValues = { user_id: 3 };
      const expectedResponse = { rows: [{ id: participantId, user_id: 3 }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Participant.editData(updatedValues, participantId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        'UPDATE participants SET user_id = $1 WHERE id = $2 RETURNING *',
        [updatedValues.user_id, participantId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete method', () => {
    it('should delete a participant by its ID', async () => {
      const participantId = 1;
      const expectedResponse = { rowCount: 1 };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await Participant.delete(participantId);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM participants WHERE id = $1', [participantId]);
      expect(result).toEqual(expectedResponse);
    });
  });
});
