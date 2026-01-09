const fs = require("fs-extra");
const path = require("path");
const warnPath = path.join(__dirname, "cache", "warns.json");

module.exports.config = {
  name: "تحذير",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "تحذير الأعضاء (3 تحذيرات = طرد)",
  commandCategory: "إدارة",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageReply, mentions, type } = event;
  if (!fs.existsSync(warnPath)) fs.outputJsonSync(warnPath, {});
  let warns = fs.readJsonSync(warnPath);

  let targetID = (type == "message_reply") ? messageReply.senderID : Object.keys(mentions)[0];
  if (!targetID) return api.sendMessage("👤 رد على الشخص أو منشنه لتحذيره.", threadID);

  if (!warns[threadID]) warns[threadID] = {};
  if (!warns[threadID][targetID]) warns[threadID][targetID] = 0;

  warns[threadID][targetID]++;
  fs.outputJsonSync(warnPath, warns);

  if (warns[threadID][targetID] >= 3) {
    warns[threadID][targetID] = 0;
    fs.outputJsonSync(warnPath, warns);
    api.removeUserFromGroup(targetID, threadID);
    return api.sendMessage("💥 العضو وصل لـ 3 تحذيرات وتم طرده نهائياً!", threadID);
  }

  return api.sendMessage(`⚠️ تحذير للعضو! (العدد الحالي: ${warns[threadID][targetID]}/3)\nانتبه المرة القادمة طرد!`, threadID);
};
