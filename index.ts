import express from 'express';
import path from 'path';
import * as logger from './utils/logger';
import * as config from './utils/config';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (_req, res): void => {
  res.render('index');
});

app.listen(config.PORT, () => {
  logger.info(`Example app listening at http://localhost:${config.PORT}`);
});
