const express = require("express");
const morgan = require("morgan");
const ConnectDB = require("./config/DB");
const { AMQ, CreatePath } = require("./MQReceiver");
const EmployeeAPILog = require("./models/APILogSchema");
const fs = require("fs");
const moment = require("moment");

ConnectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/APILog", async (req, res, next) => {
  try {
    const {
      ReqBody,
      ResBody,
      Method,
      ClientIP,
      EncKey,
      APIClientID,
      LoggedAt,
    } = req.body;
    if (
      ReqBody == null ||
      ResBody == null ||
      Method == null ||
      EncKey == null ||
      APIClientID == null ||
      LoggedAt == null
    ) {
      res.status(400).json({
        Status: "Failed",
        Info: "Bad Request",
      });
    } else {
      const Loginfo = await EmployeeAPILog.create(req.body);
      //console.log(Loginfo);
      res.status(200).json({
        Status: "Successful",
        DBRefNo: Loginfo._id,
        LoggedAt: Loginfo.DBLoggedAt,
      });

      var LogDate = moment()
        .tz("Asia/Kolkata")
        .format("MMMM Do YYYY, hh:mm:ss A");
      var FileDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
      var LogedinDB = JSON.stringify(req.body);
      //console.log('Log' + LogedinDB);
      var LogData = "|" + LogDate + "| Source - API |" + LogedinDB;

      let filename = "./Logs/APILog" + "-" + FileDate + ".log";
      // var logStream = fs.createWriteStream(filename, { flags: 'a' });
      // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
      // logStream.write(LogData + '\n');

      fs.appendFile(filename, LogData + "\n", function (err) {
        if (err) throw err;
      });

      console.log(
        `API DB Log RefNo(_id)-> ${Loginfo._id} DBLogTime -> ${Loginfo.DBLoggedAt}`
      );
    }
  } catch (error) {
    res.status(500).json({
      Status: "Failed",
      Info: error,
    });
  }
});

app.use(morgan("dev"));
CreatePath("Logs");
AMQ();

app.listen(6000, console.log(`Log Server Started on Port 6000`));
