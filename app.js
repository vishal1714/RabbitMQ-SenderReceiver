const express = require('express');
const morgan = require('morgan');
const ConnectDB = require('./config/DB');
const {AMQ , CreatePath} = require('./MQReceiver');

ConnectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));
CreatePath('Logs')
AMQ();


app.listen(
  6000,
  console.log(`Server Started in ${process.env.NODE_ENV} mode on Port 6000`)
);
