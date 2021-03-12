var amqp = require('amqplib/callback_api');
const EmployeeAPILog = require('./models/APILogSchema');
const express = require('express');

const AMQ = async () => {
  amqp.connect('amqp://vishal:vishal1714@raje.tech', function (error0, conn) {
    if (error0) {
      throw error0;
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const Queue = 'APILog';
      channel.assertQueue(Queue, {
        durable: true,
      });
      var i = 0;
      channel.consume(
        Queue,
        (msg) => {
          const Message = JSON.parse(msg.content.toString());
          const test = EmployeeAPILog.create(Message);
          console.log(`Queue Name -> ${Queue} Message ID Published-> ${i}`);
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
