const express = require("express");
const morgan = require("morgan");
const ConnectDB = require("./config/DB");
const { AMQ, CreatePath } = require("./MQReceiver");
const EmployeeAPILog = require("./models/APILogSchema");

ConnectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/APILog", async (req, res, next) => {
  try {
    const Loginfo = await EmployeeAPILog.create(req.body);
    //console.log(Loginfo);
    res.status(200).json({
      Status: "Successful",
      DBRefNo: Loginfo._id,
      LoggedAt: Loginfo.DBLoggedAt,
    });
    console.log(
      `API DB Log RefNo(_id)-> ${Loginfo._id} DBLogTime -> ${Loginfo.DBLoggedAt}`
    );
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
