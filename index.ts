import express from 'express';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (_req, res) => {
  res.render('index');
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
