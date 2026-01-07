const SERA = require("../seraCore");

module.exports.config = {
  name: "صمت",
  hasPermssion: 2,
  commandCategory: "sera",
  usages: ".صمت @شخص",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const uid = Object.keys(event.mentions || {})[0];
  if (!uid) return api.sendMessage("اذكر شخصًا.", event.threadID);

  SERA.SILENT[uid] = true;

  const msg = SERA.MODE === "DEVIL"
    ? "🔇 تم إسكات الهدف.\n👁️ الصوت لم يعد مسموحًا."
    : "🔇 تم إسكات العضو مؤقتًا.";

  api.sendMessage(msg, event.threadID);
};
