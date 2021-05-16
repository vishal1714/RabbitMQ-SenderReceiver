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

dotenv.config({ path: "./config/config.env" });

cron.schedule("* 2 * * *", function () {
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
  let ZipLogFileName = `APILog-${ZipFileDate}.log.gz`;
  //let EncLogFileName = `APILog-${ZipFileDate}.log.enc`;
  //let DecLogFileName = `APILog-${ZipFileDate}Dec.log`;
  let inputFile = path.join(__dirname, `/Logs/`, LogFileName);
  let outputFile = path.join(__dirname, `/Logs/Zip/`, ZipLogFileName);
  //let outputFile = path.join(__dirname, `/Logs/Zip/`, EncLogFileName);
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
    await dogzip(inputFile, outputFile);
    console.log(`GZIP is done -> ${ZipLogFileName}`);
  }
};

module.exports = { LogGZIP };
