const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPRION SHUTTING DOWM');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((_) => {
    console.log('DB connection successfull');
  });

const port = process.env.PORT || 3000;

//Server init
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION SHUTTING DOWM');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
