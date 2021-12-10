import 'colors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/index';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
const currentVersion = 'v0';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(`/${currentVersion}/api`, routes);

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.listen(
  PORT,
  // eslint-disable-next-line no-console
  console.log(
    `\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold,
  ),
);
