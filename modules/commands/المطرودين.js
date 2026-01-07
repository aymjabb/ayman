const SERA = require("../seraCore");

module.exports.config = {
  name: "المطرودين",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "عرض قائمة المطرودين/اللي خرجوا",
  commandCategory: "system",
  usages: ".المطرودين",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { senderID, threadID } = event;

  if (senderID !== SERA.OWNER)
    return api.sendMessage("⛔ للمالك فقط.", threadID);

  if (!SERA.LEFT_LOG.length)
    return api.sendMessage("📭 السجل فارغ.", threadID);

  let msg = "📜 سجل الخارجين:\n\n";
  SERA.LEFT_LOG.forEach((u, i) => {
    msg += `${i + 1}) ${u.id}\n`;
  });

  api.sendMessage(msg, threadID);
};
