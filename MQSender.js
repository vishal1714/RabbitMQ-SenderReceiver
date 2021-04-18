var amqp = require('amqplib/callback_api');
const moment = require('moment-timezone');

amqp.connect(
  'amqp://vishal:vishal1714@raje.tech',
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      let i = 0;
      var queue = 'APILogDB';
      while (i < 50000) {
        var FileDate = moment().tz('Asia/Kolkata').format('YYYYMMDD');
        var msg = {
                Data : {
          ReqBody: {
            EncData:
              'a9d2c8d240903501ee871d14b56b618e0d2507a54dbdd2b7293e5dd0d2de1638c5851eeb88e846bc3cc3c825a619928908af58fac9f3f93a3ecc41c9fa9517c030ba17e55fe82ad96adeb4aed$
          ResBody: {
            EncData:
              'cdfdfc5c0fce7e3050077e5220927539b861f6ff7b63b3973933673f9307f3e21ee88e1fd5a5011a01db0f35dd36d81e07aa676e2a88e6c780bd7f6d1c39a71ba71aedb1b37db4c1743d1def6'
          },
          Method: 'Add Employee',
          APIClientID: '1234567890',
          LoggedAt: 'February 18th 2021, 02:36:03 AM', },
          MQ_ID: FileDate+i
        };

        var actualmsg = JSON.stringify(msg);
        channel.assertQueue(queue, {
          durable: true,
        });
        channel.sendToQueue(queue, Buffer.from(actualmsg), {
          persistent: true,
        });
        //console.log(' [x] Sent %s', actualmsg);
        i++;
 //       console.log('Message Sent =>' + i);
      }
    });
  }
);

