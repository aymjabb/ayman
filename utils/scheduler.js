const logger = require("./logger");

function scheduleTask(bot, task, interval) {
  setInterval(async () => {
    try {
      await task(bot);
      logger.info({ type: "scheduler_run", task: task.name });
    } catch (err) {
      logger.error({ type: "scheduler_error", error: err });
    }
  }, interval);
}

module.exports = { scheduleTask };
