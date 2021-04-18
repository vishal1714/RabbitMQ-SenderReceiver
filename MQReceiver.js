var amqp = require('amqplib/callback_api');
const EmployeeAPILog = require('./models/APILogSchema');
const express = require('express');

var AMQ = async () => {
  amqp.connect('amqp://vishal:vishal1714@raje.tech', function (error0, conn) {
    if (error0) {
      throw error0;
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const Queue = 'APILogDB';
      channel.assertQueue(Queue, {
        durable: true,
      });
      var i = 0;
      channel.consume(
        Queue,
        (msg) => {
          const Message = JSON.parse(msg.content.toString());
          EmployeeAPILog.create(Message.Data);
          console.log(
            `Queue Name -> ${Queue} | Published| API ID -> ${Message.MQ_ID} | Meesage Logged Date -> ${Message.Data.LoggedAt}`
          );
          i++;
        },
        {
          noAck: true,
        }
      );
    });
  });
};

module.exports = AMQ;
