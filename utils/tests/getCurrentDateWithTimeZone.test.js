const moment = require('moment-timezone');
const { getCurrentDateWithTimeZone } = require('../getCurrentDateWithTimeZone');

describe('getCurrentDateWithTimeZone', () => {
  beforeAll(() => {
    jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
      timeZone: 'America/New_York',
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return the current date in the correct format with the specified timezone', () => {
    const expectedDate = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ssZ');
      const currentDate = getCurrentDateWithTimeZone();

    expect(currentDate).toBe(expectedDate);
  });

  it('should return a string', () => {
    const currentDate = getCurrentDateWithTimeZone();

    expect(typeof currentDate).toBe('string');
  });
});