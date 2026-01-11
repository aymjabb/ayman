const chalk = require("chalk");

function log(type, message) {
  const logEntry = { time: new Date().toISOString(), type, message };
  console.log(JSON.stringify(logEntry));
}

module.exports = {
  info: (msg) => log("info", msg),
  warn: (msg) => log("warn", msg),
  error: (msg) => log("error", msg),
  success: (msg) => log("success", msg),
};
