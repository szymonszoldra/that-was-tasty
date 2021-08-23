import express from 'express';
import path from 'path';
import * as logger from './utils/logger';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (_req, res): void => {
  res.render('index');
});

const PORT = 3001;

app.listen(PORT, () => {
  logger.info(`Example app listening at http://localhost:${PORT}`);
});
