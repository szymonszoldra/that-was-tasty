import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (_req, res): void => {
  res.render('index');
});

export default app;
