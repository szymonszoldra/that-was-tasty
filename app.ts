import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import * as config from './utils/config';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'dist')));

mongoose.connect(config.MONGODB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log('Connected');
  const temp = new mongoose.Schema({
    name: String,
  });
  const Cat = mongoose.model('Cat', temp);

  const kitty = new Cat({ name: 'Zildjian' });
  kitty.save().then(() => console.log('meow'));
}).catch((e) => console.log(e));

app.get('/', (_req, res): void => {
  res.render('index');
});

export default app;
