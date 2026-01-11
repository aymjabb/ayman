const { respondAI } = require("../ai/openai");
const logger = require("../utils/logger");

module.exports = {
  name: "message",
  run: async (bot, event) => {
    try {
      const message = event.body;
      if (!message) return;

      const args = message.split(" ");
      const commandName = args[0].toLowerCase();

      if (global.commands.has(commandName)) {
        const cmd = global.commands.get(commandName);
        await cmd.run({ bot, event, args });
      } else {
        // أي رسالة غير معروفة → AI
        const reply = await respondAI(message);
        if (reply) await bot.sendMessage(reply, event.threadID);
      }
    } catch (err) {
      logger.error({ type: "message_handler_error", error: err });
    }
  },
};
