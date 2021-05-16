var amqp = require("amqplib/callback_api");
const EmployeeAPILog = require("./models/APILogSchema");
const express = require("express");
const fs = require("fs");
const moment = require("moment");

var AMQ = async () => {
  amqp.connect("amqp://vishal:vishal1714@raje.tech", function (error0, conn) {
    if (error0) {
      throw error0;
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const Queue = "APILogDB";
      const Queue1 = "APILogFile";
      channel.assertQueue(Queue, {
        durable: true,
      });
      channel.assertQueue(Queue1, {
        durable: true,
      });
      channel.prefetch(10);
      channel.consume(
        Queue,
        (msg) => {
          const Message = JSON.parse(msg.content.toString());
          EmployeeAPILog.create(Message.Data);
          console.log(
            `MQ ID -> ${Message.MQ_ID} | Queue Name -> ${Queue} | Meesage Logged Date -> ${Message.Data.LoggedAt}`
          );
        },
        {
          noAck: true,
        }
      );

      channel.consume(
        Queue1,
        (msg) => {
          const Message = JSON.parse(msg.content.toString());
          var LogDate = moment()
            .tz("Asia/Kolkata")
            .format("MMMM Do YYYY, hh:mm:ss A");
          var FileDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
          var LogedinDB = JSON.stringify(Message);
          //console.log('Log' + LogedinDB);
          var LogData = "|" + LogDate + "| Source - MQ |" + LogedinDB;

          let filename = "./Logs/APILog" + "-" + FileDate + ".log";
          // var logStream = fs.createWriteStream(filename, { flags: 'a' });
          // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
          // logStream.write(LogData + '\n');

          fs.appendFile(filename, LogData + "\n", function (err) {
            if (err) throw err;
          });
        },
        {
          noAck: true,
        }
      );
    });
  });
};

function CreatePath(filePath) {
  if (fs.existsSync(filePath)) {
  } else {
    fs.mkdirSync(filePath);
  }
}

module.exports = { AMQ, CreatePath };
