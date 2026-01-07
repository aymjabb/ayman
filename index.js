const fs = require("fs");
const { Client } = require("some-bot-library");
const bot = new Client();
const SMART = require("./sera/smartSystem");

const commands = {};
fs.readdirSync("./commands").forEach(file => {
  if (file.endsWith(".js")) {
    const cmd = require(`./commands/${file}`);
    commands[cmd.config.name] = cmd;
  }
});

bot.on("message", async (event) => {
  const { body } = event;
  if (!body) return;

  for (const cmdName in commands) {
    const cmd = commands[cmdName];
    try {
      if (cmd.run) await cmd.run({ api: bot, event });
      if (cmd.handleEvent) await cmd.handleEvent({ api: bot, event });
    } catch (err) {
      console.log("❌ خطأ في الأمر:", cmdName, err);
    }
  }
});

bot.login("YOUR_TOKEN_HERE");
