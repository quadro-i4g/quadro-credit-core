/* eslint-disable no-console */
require('colors');
require('dotenv').config();
require('express-async-errors');

const cors = require('cors');
const cpus = require('os').cpus();
const cluster = require('cluster');
const express = require('express');
const compression = require('compression');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 2021;
const currentVersion = 'v1';

app.use(cors());
app.use(compression()); // Node.js compression middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

const connectToDatabase = require('./config/db');
const rootRouter = require('./routes/index')(router);
const ErrorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./utils/appError');

const isProduction = process.env.NODE_ENV === 'production';
connectToDatabase();

if (!isProduction) {
  // eslint-disable-next-line global-require
  app.use(require('morgan')('dev'));
}

// Remove trailing slashes
app.use((req, res, next) => {
  if (req.path.substr(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

app.use(`/api/${currentVersion}`, rootRouter);

app.get('/', (req, res) => {
  res.send('Quadro Credit API is running....');
});

app.all('*', () => {
  throw new NotFoundError();
});

// For handling server errors and all other errors that might occur
app.use(ErrorHandler);

if (cluster.isMaster) {
  // Fork workers
  cpus.forEach(() => cluster.fork());

  cluster.on('exit', () => cluster.fork());
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  const server = app.listen(PORT, () => {
    console.log(
      ':>>'.green.bold,
      'Server running in'.yellow.bold,
      process.env.NODE_ENV.toUpperCase().blue.bold,
      'mode, on port'.yellow.bold,
      `${PORT}`.blue.bold,
    );
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', error => {
    console.error(`✖ | Uncaught Exception: ${error.message}`.red.bold);
    server.close(() => process.exit(1));
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', error => {
    console.error(`✖ | Unhandled Rejection: ${error.message}`.red.bold);
    server.close(() => process.exit(1));
  });
}
