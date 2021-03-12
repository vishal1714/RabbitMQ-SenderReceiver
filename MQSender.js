var amqp = require('amqplib/callback_api');

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
      var queue = 'APILog';
      while (i < 1000) {
        var msg = {
          ReqBody: {
            Refno: '6f75a8fa719b56c707bb72f3e217d143',
            Data:
              'a9d2c8d240903501ee871d14b56b618e0d2507a54dbdd2b7293e5dd0d2de1638c5851eeb88e846bc3cc3c825a619928908af58fac9f3f93a3ecc41c9fa9517c030ba17e55fe82ad96adeb4aedf6490df74931b49ae33242637487d752f91cdb3e79d2dc44afc76ed7f435e0f4d85e1c8',
          },
          ResBody: {
            Refno: '4d737f07811148ba77d3f6d0ef9c9c7c',
            Data:
              'cdfdfc5c0fce7e3050077e5220927539b861f6ff7b63b3973933673f9307f3e21ee88e1fd5a5011a01db0f35dd36d81e07aa676e2a88e6c780bd7f6d1c39a71ba71aedb1b37db4c1743d1def6f7e197c2d67a3e753c9260e12277714d5404dc02b8131acc441278f2584357eafbbc839acff2f63897a8999764be34e4185441c6a8bb9eaa73db0eb5e4bb1568cec111aeface500d5f1bc634432c040b84fe977f08c2cda15d28e020cd20e35ddf9be32864db1a19ff07624d6cb18068a58aee1c935c0910774af664965e7531001031e316861b835572dd7823d92ce9317d8ac99a46f72019d87f7ece77560491567d48eaa86cb019acb02d2f7e8ad8b31af1e8c360c1515b115a6b31ced27202e26703372c2b319fa4d46ddb8c0c2c07cb176a1d3c3fb1dc5598c62c5971bb86938c4ba7b8895fc72feefbdec5316b7b545468a9d36907d52297f9c306b2d3f5b08f0',
          },
          Method: 'Add Employee',
          APIClientID: '1234567890',
          LoggedAt: 'February 18th 2021, 02:36:03 AM',
        };

        var actualmsg = JSON.stringify(msg);

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(actualmsg));
        console.log(' [x] Sent %s', actualmsg);
        i++;
        //console.log(i);
      }
    });
  }
);
