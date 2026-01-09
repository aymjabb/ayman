const os = require("os");

module.exports.config = {
  name: "فحص",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "فحص حالة السيرفر وسرعة البوت",
  commandCategory: "نظام",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const timeStart = Date.now();
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  return api.sendMessage(
    `📊 حـالـة نـظـام سـيـرا تـشـان:\n` +
    `──────────────────\n` +
    `⏱️ الـسـرعـة: ${Date.now() - timeStart}ms\n` +
    `🧠 الـذاكـرة: ${memoryUsage.toFixed(2)} MB\n` +
    `⌛ الـتـشـغـيـل: ${hours} ساعة و ${minutes} دقيقة\n` +
    `🌐 الـنـظـام: ${os.platform()} (${os.arch()})\n` +
    `──────────────────\n` +
    `🐾 سيرا تعمل بكامل طاقتها يا أيمن!`,
    event.threadID
  );
};
