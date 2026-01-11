const { Client } = require("some-bot-library"); // ضع مكتبتك هنا
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const { initAI } = require("./ai/openai");
const { loginWithAppState } = require("./utils/login");

const bot = new Client();
global.client = bot;

// تحميل الأوامر والأحداث
global.commands = new Map();
global.events = new Map();

// ---------------------- Load Commands ----------------------
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath)
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
    const cmd = require(path.join(commandsPath, file));
    if (cmd.config?.name) {
      global.commands.set(cmd.config.name, cmd);
      logger.info(`Command loaded: ${cmd.config.name}`);
    }
  });

// ---------------------- Load Events ----------------------
const eventsPath = path.join(__dirname, "events");
fs.readdirSync(eventsPath)
  .filter(f => f.endsWith(".js"))
  .forEach(file => {
    const event = require(path.join(eventsPath, file));
    if (event.name && typeof event.run === "function") {
      global.events.set(event.name, event);
      bot.on(event.name, (...args) => event.run(bot, ...args));
      logger.info(`Event loaded: ${event.name}`);
    }
  });

// ---------------------- Message Handler ----------------------
bot.on("message", async (event) => {
  try {
    const message = event.body;
    if (!message) return;

    // محاولة تنفيذ أي أمر مطابق
    const args = message.split(" ");
    const commandName = args[0].toLowerCase();
    if (global.commands.has(commandName)) {
      const cmd = global.commands.get(commandName);
      await cmd.run({ bot, event, args });
      return;
    }

    // إذا ما كان هناك أمر، يرد AI
    const reply = await initAI(message);
    if (reply) {
      await bot.sendMessage(reply, event.threadID);
    }
  } catch (err) {
    logger.error("Error in message handler:", err);
  }
});

// ---------------------- Login باستخدام Appstate ----------------------
(async () => {
  try {
    await loginWithAppState(bot, "./appstate.json");
    logger.success("Bot is now online!");
  } catch (err) {
    logger.error("Failed to login with Appstate:", err);
  }
})();
