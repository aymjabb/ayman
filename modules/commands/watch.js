const SERA = require("../seraCore");

module.exports.config = {
  name: "راقب",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "مراقبة شخص",
  commandCategory: "system",
  usages: ".راقب @شخص",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { senderID, threadID, mentions } = event;

  if (senderID !== SERA.OWNER)
    return api.sendMessage("⛔ للمالك فقط.", threadID);

  const id = Object.keys(mentions)[0];
  if (!id) return api.sendMessage("⚠️ منشن الشخص.", threadID);

  SERA.WATCH[id] = true;
  api.sendMessage("👁️ تم تفعيل المراقبة.", threadID);
};
