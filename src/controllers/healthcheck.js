const logger = require('../utils/logger');

const healthcheck = (req, res) => {
  logger.info('GET /api/v1/healthcheck called');
  logger.error('This is an error message');
  logger.warn('This is a warning');
  logger.info('This is an informational message');
  logger.debug('Debugging details here');
  logger.verbose('Verbose level logging for deep trace');
  res.status(200).json({ message: 'Healthcheck!!' });
};

module.exports = { healthcheck };
