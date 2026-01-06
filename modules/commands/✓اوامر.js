module.exports.config = {
  name: "اوامر",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "انس • مزخرف بواسطة Sera Chan",
  description: "قائمة أوامر البوت مزخرفة Ultra-Fancy 💖✨",
  commandCategory: "النظام",
  usages: ".اوامر [اسم الأمر]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300 // 5 دقائق
  }
};

module.exports.languages = {
  "en": {
    "moduleInfo": "「 %1 」\n💖 %2 💖\n\n🍃 Usage: %3\n🌸 Category: %4\n⏱️ Wait: %5 seconds\n🔑 Permission: %6\n\n✨ Developed by %7 ✨",
    "helpList": "[ There are %1 commands in the bot! Use: \"%2help commandName\" to see details! 😻 ]",
    "user": "User 😸",
    "adminGroup": "Group Admin 🌟",
    "adminBot": "Bot Admin 🔥"
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body === "cmd" || !body.toLowerCase().startsWith("help")) return;

  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🎇","🌈","🌀"];
  const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];

  return api.sendMessage(
    getText(
      "moduleInfo",
      `💫${command.config.name}💫 ${randomDeco()}`,
      `🌸${command.config.description}🌸`,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      `📂 ${command.config.commandCategory}`,
      `${command.config.cooldowns}`,
      ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🎇","🌈","🌀"];
  const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];

  // ترتيب الأوامر حسب الفئة
  const categories = {};
  for (let [name, cmd] of commands) {
    if (!categories[cmd.config.commandCategory]) categories[cmd.config.commandCategory] = [];
    categories[cmd.config.commandCategory].push(cmd);
  }

  if (!args[0]) {
    // عرض قائمة كل الأوامر مزخرفة Ultra-Fancy
    let msg = `💖✨🌟🎇🌀 Sera Chan's Ultra-Fancy Command List 🌀🎇🌟✨💖\n\n`;

    for (let cat in categories) {
      msg += `📂 ── ${cat.toUpperCase()} ── 📂\n`;
      categories[cat].forEach((cmd, i) => {
        msg += `${randomDeco()} 💫 ${i+1}. ${cmd.config.name} ${randomDeco()}\n  🌸 وصف: ${cmd.config.description}\n\n`;
      });
      msg += `--------------------------------\n\n`;
    }

    msg += `💖✨🌟 Sera Chan ترحب بك وتجعل تجربتك ممتعة جدًا! 🌟✨💖`;

    return api.sendMessage(msg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  } else {
    // عرض تفاصيل أمر محدد مزخرف
    const command = commands.get(args[0].toLowerCase());
    if (!command) return api.sendMessage(`❌ الأمر "${args[0]}" غير موجود! ${randomDeco()}`, threadID, messageID);

    const msg = getText(
      "moduleInfo",
      `💫${command.config.name}💫 ${randomDeco()}`,
      `🌸${command.config.description}🌸`,
      `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
      `📂 ${command.config.commandCategory}`,
      `${command.config.cooldowns}`,
      ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
      command.config.credits
    );

    return api.sendMessage(msg, threadID, messageID);
  }
};
