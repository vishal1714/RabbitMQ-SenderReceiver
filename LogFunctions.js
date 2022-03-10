const moment = require("moment");
const cron = require("node-cron");
const fs = require("fs");
const dotenv = require("dotenv");
const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const { createCipheriv, createDecipheriv } = require("crypto");
const crypto = require("crypto");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const { promisify } = require("util");
const pipe = promisify(pipeline);
const S3 = require("aws-sdk/clients/s3");

dotenv.config({ path: "./config/config.env" });

const bucket = process.env.AWS_BUCKET;
const accessKeyId = process.env.AWS_ID;
const secretAccessKey = process.env.AWS_KEY;
const region = process.env.AWS_ZONE;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//upload file
const UploadFile = (filepath, Filename) => {
  try {
    const filestream = fs.createReadStream(filepath);

    const params = {
      Bucket: bucket,
      Key: "APILogs/"+Filename, // File name you want to save as in S3
      Body: filestream,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
  } catch (error) {}
};

cron.schedule("0 1 * * *", function () {
  //59 */23 * * *
  var Currentdate = moment()
    .tz("Asia/Kolkata")
    .format("MMMM Do YYYY, hh:mm:ss A");
  console.log(`--------------------- Cron Job Running --------------------`);
  console.log(`Date & Time - ${Currentdate} `);
  console.log(`Gziping Yesterdays API Log to Save Space`);
  LogGZIP();
  console.log(`------ Finish ------`);
});

const LogGZIP = async () => {
  let yesterday = moment().add(-1, "days");
  var FileDate = yesterday.tz("Asia/Kolkata").format("YYYY-MM-DD");
  var ZipFileDate = yesterday.tz("Asia/Kolkata").format("YYYY-MM-DD");
  let LogFileName = `APILog-${FileDate}.log`;
  let ApprovalLogFileName = `APIApprovedReq-${FileDate}.log`;
  let ZipLogFileName = `APILog-${ZipFileDate}.log.gz`;
  let ApprovedFileName = `APIApproval-${ZipFileDate}.log.gz`;
  //let DecLogFileName = `APILog-${ZipFileDate}Dec.log`;
  let inputFile = path.join(__dirname, `/Logs/`, LogFileName);
  let inputApprovalFile = path.join(__dirname, `/Logs/`, ApprovalLogFileName);
  let outputFile = path.join(__dirname, `/Logs/Zip/`, ZipLogFileName);
  let outputApprovedFile = path.join(__dirname, `/Logs/Zip/`, ApprovedFileName);
  // ! Gzip File Function

  const dogzip = async (input, output) => {
    try {
      const gzip = createGzip();
      //const Enc = createCipheriv("aes-256-cbc", key, iv);
      //const Dec = createDecipheriv("aes-256-cbc", key, iv);
      const source = createReadStream(input);
      const destination = createWriteStream(output);
      await pipe(source, gzip, destination);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  if (fs.existsSync(inputFile)) {
    if (!fs.existsSync(outputFile)) {
      await UploadFile(inputFile, LogFileName);
      await UploadFile(inputApprovalFile, ApprovalLogFileName);
      await dogzip(inputFile, outputFile).then(fs.unlinkSync(inputFile));
      await dogzip(inputApprovalFile, outputApprovedFile).then(fs.unlinkSync(inputApprovalFile));
      console.log(`GZIP is done -> ${ZipLogFileName}`);
    }
  }
};

module.exports = { LogGZIP };
