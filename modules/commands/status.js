const SERA = require("../seraCore");

module.exports.config = {
  name: "حالة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "عرض حالة سيرا",
  commandCategory: "system",
  usages: ".حالة",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  const mode =
    SERA.MODE === "DEVIL" ? "👁️ ابنة إبليس" : "🩷 ابنة أيمن";

  api.sendMessage(
    `📜 حالة سيرا:\n\n` +
    `• الوضع: ${mode}\n` +
    `• المراقَبين: ${Object.keys(SERA.WATCH).length}\n` +
    `• الصامتين: ${Object.keys(SERA.SILENT).length}`,
    threadID
  );
};
