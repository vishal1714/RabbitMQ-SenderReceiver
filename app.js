const express = require("express");
const morgan = require("morgan");
const ConnectDB = require("./config/DB");
const { APILogMQRec,ApprovalMQ, CreatePath } = require("./MQReceiver");
const Cron = require("./LogFunctions");
const EmployeeAPILog = require("./models/APILogSchema");
const EmployeeSchema = require("./models/EmployeeSchema");
const fs = require("fs");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config({ path: "./Config.env" });

ConnectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/APILog", async (req, res, next) => {
  var reqKey = req.header("API-Admin-Key");
  try {
    if (reqKey == "Vishal") {
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
        var LoggedinFile = {
          Data: req.body,
          DBRefNo: Loginfo._id,
        };
        var Loged = JSON.stringify(LoggedinFile);
        //console.log('Log' + LogedinDB);
        var LogData = "|" + LogDate + "| Source - API |" + Loged;

        let filename = "./Logs/APILog" + "-" + FileDate + ".log";
        // var logStream = fs.createWriteStream(filename, { flags: 'a' });
        // use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
        // logStream.write(LogData + '\n');

        fs.appendFile(filename, LogData + "\n", function (err) {
          if (err) throw err;
        });

        console.log(
          `API DBRefNo - ${Loginfo._id} DBLogTime -> ${Loginfo.DBLoggedAt}`
        );
      }
    } else {
      res.status(401).json({
        Status: 401,
        Message: "Incorrect Admin Password",
      });
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
CreatePath("Logs/Zip");
APILogMQRec();
ApprovalMQ("AddEmployee_Initiate",EmployeeSchema)
app.listen(6000, console.log(`Log Server Started on Port 6000`));
