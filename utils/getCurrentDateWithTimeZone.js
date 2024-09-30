const moment = require('moment-timezone');

exports.getCurrentDateWithTimeZone = () => {
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = moment().tz(currentTimeZone).format('YYYY-MM-DD HH:mm:ssZ');

  return currentDate;
};
