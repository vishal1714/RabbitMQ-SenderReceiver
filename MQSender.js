const amqp = require("amqplib/callback_api");
const moment = require("moment-timezone");
var os = require("os");

amqp.connect("amqp://vishal:vishal1714@raje.tech", function (error0, conn) {
  if (error0) {
    throw error0;
  }
  var exchange = "APILog";
  conn.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var hostname = os.hostname();
    var DayID = moment().tz("Asia/Kolkata").format("YYYYMMDD-");

    var Message = JSON.stringify(msg);

    const Queue1 = "APILogFile";
    const Queue2 = "APILogDB";

    channel.assertExchange(exchange, "fanout", {
      durable: true,
    });
    channel.assertQueue(Queue1, {
      durable: true,
    });
    channel.assertQueue(Queue2, {
      durable: true,
    });
    let i = 0;
    while (i <= 300000) {
      var msg = {
        Data: {
          ReqBody: {
            EncData:
              "a9d2c8d240903501ee871d14b56b618e0d2507a54dbdd2b7293e5dd0d2de1638c5851eeb88e846bc3cc3c825a619928908af58fac9f3f93a3ecc41c9fa9517c030ba17e55fe82ad96adeb4aed",
          },
          ResBody: {
            EncData:
              "cdfdfc5c0fce7e3050077e5220927539b861f6ff7b63b3973933673f9307f3e21ee88e1fd5a5011a01db0f35dd36d81e07aa676e2a88e6c780bd7f6d1c39a71ba71aedb1b37db4c1743d1def6",
          },
          Method: "Add Employee",
          APIClientID: "1234567890",
          LoggedAt: "February 18th 2021, 02:36:03 AM",
        },
        MQ_ID: DayID + hostname + "-" + i,
      };
      var Message = JSON.stringify(msg);
      channel.publish(exchange, "", Buffer.from(Message));
      i++;
    }
    /*
      channel.assertQueue(Queue, {
        durable: true,
      });
      channel.sendToQueue(Queue, Buffer.from(Message), { persistent: true });
      */
  });
});
