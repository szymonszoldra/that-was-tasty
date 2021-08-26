import http from 'http';
import app from './app';
import * as logger from './utils/logger';
import * as config from './utils/config';

const server = http.createServer(app);

server.listen(config.PORT, (): void => {
  logger.info(`Server running on port ${config.PORT}`);
});
